package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.request.*;
import com.project.courseweb.dtos.response.AuthenticatedResponse;
import com.project.courseweb.dtos.response.IntrospectTokenResponse;
import com.project.courseweb.dtos.response.TokenResponse;
import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.entities.authentication.RefreshToken;
import com.project.courseweb.entities.authentication.Role;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.Roles;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.AuthMapper;
import com.project.courseweb.repositories.AuthRepository;
import com.project.courseweb.repositories.RefreshTokenRepository;
import com.project.courseweb.repositories.https.GoogleOauth2Client;
import com.project.courseweb.repositories.https.GoogleUserInfoClient;
import com.project.courseweb.services.JwtService;
import com.project.courseweb.services.RedisService;
import com.project.courseweb.services.RoleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock AuthMapper authMapper;
    @Mock RoleService roleService;
    @Mock AuthRepository authRepository;
    @Mock RefreshTokenRepository refreshTokenRepository;
    @Mock BCryptPasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock RedisService redisService;
    @Mock GoogleOauth2Client googleOauth2Client;
    @Mock GoogleUserInfoClient googleUserInfoClient;

    @InjectMocks AuthServiceImpl authService;

    @BeforeEach
    void setUp() throws Exception {
        // Inject @Value fields via reflection since we use @InjectMocks without Spring context
        var clientIdField = AuthServiceImpl.class.getDeclaredField("clientId");
        clientIdField.setAccessible(true);
        clientIdField.set(authService, "clientId");
        var clientSecretField = AuthServiceImpl.class.getDeclaredField("clientSecret");
        clientSecretField.setAccessible(true);
        clientSecretField.set(authService, "clientSecret");
        var grantTypeField = AuthServiceImpl.class.getDeclaredField("grantType");
        grantTypeField.setAccessible(true);
        grantTypeField.set(authService, "authorization_code");
        var redirectUrlField = AuthServiceImpl.class.getDeclaredField("redirectUrl");
        redirectUrlField.setAccessible(true);
        redirectUrlField.set(authService, "http://localhost/callback");

        // Reset SecurityContext
        SecurityContextHolder.clearContext();
    }

    @Test
    void authenticated_shouldThrow_whenEmailNotFoundOrPasswordMismatch() {
        AuthenticatedRequest req = new AuthenticatedRequest();
        req.setEmail("user@example.com");
        req.setPassword("secret1234");

        when(authRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.authenticated(req))
                .isInstanceOf(AppException.class)
                .hasMessageContaining(ErrorCode.AUTHENTICATION_FAILED.name());

        Auth auth = new Auth();
        auth.setPasswordHash("hash");
        when(authRepository.findByEmail("user@example.com")).thenReturn(Optional.of(auth));
        when(passwordEncoder.matches("secret1234", "hash")).thenReturn(false);

        assertThatThrownBy(() -> authService.authenticated(req))
                .isInstanceOf(AppException.class)
                .hasMessageContaining(ErrorCode.AUTHENTICATION_FAILED.name());
    }

    @Test
    void refreshToken_shouldIssueNewTokens_whenValidAndNotRevoked() {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("oldRefresh");

        Auth auth = new Auth();
        auth.setId(1L);

        RefreshToken stored = RefreshToken.builder()
                .auth(auth)
                .token("oldRefresh")
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByToken("oldRefresh")).thenReturn(Optional.of(stored));
        when(jwtService.validateToken("oldRefresh")).thenReturn(true);

        // Security context belongs to same user id so it will mark previous token revoked
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(new TestingAuthenticationToken("1", null));
        SecurityContextHolder.setContext(context);

        when(authRepository.findById(1L)).thenReturn(Optional.of(auth));
        when(jwtService.generateAccessToken(auth)).thenReturn("newAccess");
        when(jwtService.generateRefreshToken(auth)).thenReturn("newRefresh");
        Date now = Date.from(Instant.now());
        when(jwtService.getIssuedAtDateFromToken("newRefresh")).thenReturn(now);
        when(jwtService.getExpirationDateFromToken("newRefresh")).thenReturn(now);
        when(jwtService.getIssuedAtDateFromToken("newAccess")).thenReturn(now);
        when(jwtService.getExpirationDateFromToken("newAccess")).thenReturn(now);
        when(jwtService.getExpirationTimeFromToken(anyString())).thenReturn(60L);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(inv -> inv.getArgument(0));

        TokenResponse response = authService.refreshToken(request);

        assertThat(response.getAccessToken()).isEqualTo("newAccess");
        assertThat(response.getRefreshToken()).isEqualTo("newRefresh");
        assertThat(stored.isRevoked()).isTrue();
    }

    @Test
    void refreshToken_shouldThrow_whenTokenNotFoundOrRevoked() {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("missing");

        when(refreshTokenRepository.findByToken("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refreshToken(request))
                .isInstanceOf(AppException.class)
                .hasMessageContaining(ErrorCode.REFRESH_TOKEN_NOT_FOUND.name());

        // Token exists but validateToken true AND already revoked -> REFRESH_TOKEN_FAILED
        Auth auth = new Auth();
        auth.setId(10L);
        RefreshToken stored = RefreshToken.builder().auth(auth).token("t").revoked(true).build();
        when(refreshTokenRepository.findByToken("missing")).thenReturn(Optional.of(stored));
        when(jwtService.validateToken("t")).thenReturn(true);

        assertThatThrownBy(() -> authService.refreshToken(request))
                .isInstanceOf(AppException.class)
                .hasMessageContaining(ErrorCode.REFRESH_TOKEN_FAILED.name());
    }

    @Test
    void logout_shouldBlacklistAccessToken_andRevokeAllRefreshTokens() {
        LogoutRequest request = new LogoutRequest();
        request.setAccessToken("access");

        when(jwtService.validateToken("access")).thenReturn(true);
        when(jwtService.getExpirationTimeFromToken("access")).thenReturn(120L);

        // auth id 5
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(new TestingAuthenticationToken("5", null));
        SecurityContextHolder.setContext(context);

        RefreshToken t1 = RefreshToken.builder().revoked(false).build();
        RefreshToken t2 = RefreshToken.builder().revoked(false).build();
        when(refreshTokenRepository.findByAuthId(5L)).thenReturn(List.of(t1, t2));

        authService.logout(request);

        verify(redisService).blackListAccessToken("access", 120L);
        assertThat(t1.isRevoked()).isTrue();
        assertThat(t2.isRevoked()).isTrue();
        verify(refreshTokenRepository).saveAll(argThat(list -> list.size() == 2));
    }

    @Test
    void introspectToken_shouldReturnValidationResult() {
        IntrospectTokenRequest req = new IntrospectTokenRequest();
        req.setToken("tkn");
        when(jwtService.validateToken("tkn")).thenReturn(true);

        IntrospectTokenResponse res = authService.introspectToken(req);
        assertThat(res.isResult()).isTrue();
    }
}
