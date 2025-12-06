package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.request.*;
import com.project.courseweb.dtos.response.AuthenticatedResponse;
import com.project.courseweb.dtos.response.IntrospectTokenResponse;
import com.project.courseweb.dtos.response.TokenResponse;
import com.project.courseweb.dtos.response.UserResponse;
import com.project.courseweb.entities.Profile;
import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.entities.authentication.RefreshToken;
import com.project.courseweb.entities.authentication.Role;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.Roles;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.httpsClients.GoogleOauth2Client;
import com.project.courseweb.httpsClients.GoogleUserInfoClient;
import com.project.courseweb.mappers.AuthMapper;
import com.project.courseweb.repositories.AuthRepository;
import com.project.courseweb.repositories.RefreshTokenRepository;
import com.project.courseweb.services.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {
    AuthMapper authMapper;
    RoleService roleService;
    AuthRepository authRepository;
    RefreshTokenRepository refreshTokenRepository;
    BCryptPasswordEncoder bCryptPasswordEncoder;
    JwtService jwtService;
    ProfileServiceImpl profileServiceImpl;
    RedisService redisService;
    GoogleOauth2Client googleOauth2Client;
    GoogleUserInfoClient googleUserInfoClient;
    NotificationService notificationService;
    @NonFinal
    @Value("${google.client-id}")
    String clientId;
    @NonFinal
    @Value("${google.client-secret}")
    String clientSecret;
    @NonFinal
    @Value("${google.grant-type}")
    String grantType;
    @NonFinal
    @Value("${google.redirect-uri}")
    String redirectUrl;

    @Transactional
    @Override
    public UserResponse createUser(UserCreateRequest userCreateRequest) {
        this.checkEmailPhone(userCreateRequest.getEmail(), userCreateRequest.getPhone());
        var auth = authMapper.toAuth(userCreateRequest);
        auth.setPasswordHash(bCryptPasswordEncoder.encode(userCreateRequest.getPassWord()));
        auth.getProfile().setAuth(auth);
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.getRoleByName(Roles.USER.name()));
        auth.setRoles(roles);
        var response = authRepository.save(auth);

        String userName = auth.getProfile().getFullName();
        this.notificationService.sendWelcomeEmail(auth.getEmail(), userName);
        return authMapper.toUserResponse(response);
    }

    @Override
    public AuthenticatedResponse authenticated(AuthenticatedRequest authenticatedRequest) {
        Optional<Auth> optionalAuth = this.authRepository.findByEmail((authenticatedRequest.getEmail()));
        if (optionalAuth.isEmpty()) {
            throw new AppException(ErrorCode.AUTHENTICATION_FAILED);
        }
        var auth = optionalAuth.get();
        if (!bCryptPasswordEncoder.matches(authenticatedRequest.getPassword(), auth.getPasswordHash())) {
            throw new AppException(ErrorCode.AUTHENTICATION_FAILED);
        }
        String accessToken = jwtService.generateAccessToken(auth);
        String refreshToken = jwtService.generateRefreshToken(auth);
        var refreshTokenEntity = this.refreshTokenRepository.save(RefreshToken.builder()
                .auth(auth)
                .token(refreshToken)
                .issueTime(this.jwtService.getIssuedAtDateFromToken(refreshToken))
                .expiryTime(this.jwtService.getExpirationDateFromToken(refreshToken))
                .build()
        );
        return AuthenticatedResponse.builder()
                .user(this.authMapper.toUserResponse(auth))
                .token(TokenResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .accessExpiresAt(jwtService.getExpirationDateFromToken(accessToken))
                        .refreshExpiresAt(refreshTokenEntity.getExpiryTime())
                        .accessIssuedAt(jwtService.getIssuedAtDateFromToken(accessToken))
                        .refreshIssuedAt(refreshTokenEntity.getIssueTime())
                        .accessExpirationTime(jwtService.getExpirationTimeFromToken(accessToken))
                        .refreshExpirationTime(jwtService.getExpirationTimeFromToken(refreshToken))
                        .build()
                )
                .build();
    }

    @Override
    public AuthenticatedResponse authenticatedUserGoogle(String code) {
        var tokenResponse = this.googleOauth2Client.exchangeToken(
                ExchangeTokenRequest.builder()
                        .clientId(clientId)
                        .clientSecret(clientSecret)
                        .code(code)
                        .grantType(grantType)
                        .redirectUri(redirectUrl)
                        .build()
        );
        log.info("tokenResponse={}", tokenResponse);
        var userGG = this.googleUserInfoClient.getUserInfo("json", Objects.requireNonNull(tokenResponse).getAccessToken());
        log.info("userGG={}", userGG);

        Set<Role> roles = new HashSet<>();
        roles.add(roleService.getRoleByName(Roles.USER.name()));

        var auth = this.authRepository.findByEmail(userGG.getEmail()).orElseGet(
                () -> {
                    var auths = Auth.builder()
                            .email(userGG.getEmail())
                            .build();
                    auths.setRoles(roles);
                    auths.setProfile(Profile.builder().auth(auths)
                            .fullName(userGG.getName())
                            .avatar(userGG.getPicture())
                            .build());
                    return this.authRepository.save(auths);
                }
        );
        String accessToken = jwtService.generateAccessToken(auth);
        String refreshToken = jwtService.generateRefreshToken(auth);
        var refreshTokenEntity = this.refreshTokenRepository.save(RefreshToken.builder()
                .auth(auth)
                .token(refreshToken)
                .issueTime(this.jwtService.getIssuedAtDateFromToken(refreshToken))
                .expiryTime(this.jwtService.getExpirationDateFromToken(refreshToken))
                .build()
        );
        return AuthenticatedResponse.builder()
                .user(this.authMapper.toUserResponse(auth))
                .token(TokenResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .accessExpiresAt(jwtService.getExpirationDateFromToken(accessToken))
                        .refreshExpiresAt(refreshTokenEntity.getExpiryTime())
                        .accessIssuedAt(jwtService.getIssuedAtDateFromToken(accessToken))
                        .refreshIssuedAt(refreshTokenEntity.getIssueTime())
                        .accessExpirationTime(jwtService.getExpirationTimeFromToken(accessToken))
                        .refreshExpirationTime(jwtService.getExpirationTimeFromToken(refreshToken))
                        .build()
                )
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @Transactional
    @Override
    public void deleteAccount() {
        Long currentUserId = profileServiceImpl.getId();
        refreshTokenRepository.deleteByAuthId(currentUserId);
        authRepository.deleteById(currentUserId);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        this.authRepository.findByEmail(request.getEmail()).ifPresent(auth -> {
            String otpValue = generateOtp();
            String redisKey = "password-reset-otp::" + auth.getEmail();
            redisService.saveOtp(redisKey, otpValue, 10);
            notificationService.sendForgotPasswordEmail(auth.getEmail(), auth.getProfile().getFullName(), otpValue);
        });
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        this.authRepository.findByEmail(request.getEmail()).ifPresent(auth -> {
            String redisKey = "password-reset-otp::" + auth.getEmail();
            String otpValue = redisService.getOtp(redisKey);
            if (otpValue == null || !otpValue.equals(request.getOtp())) {
                throw new AppException(ErrorCode.INVALID_OTP);
            }
            auth.setPasswordHash(bCryptPasswordEncoder.encode(request.getNewPassword()));
            authRepository.save(auth);

            redisService.deleteOtp(redisKey);
        });
    }

    private String generateOtp() {
        return new DecimalFormat("000000").format(new Random().nextInt(999999));
    }

    @Override
    public TokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        Optional<RefreshToken> optionalRefreshToken = this.refreshTokenRepository
                .findByToken(refreshTokenRequest.getRefreshToken());
        if (optionalRefreshToken.isEmpty()) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        RefreshToken refreshToken = optionalRefreshToken.get();
        if (this.jwtService.validateToken(refreshToken.getToken()) && refreshToken.isRevoked()) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_FAILED);
        }
        var id = SecurityContextHolder.getContext().getAuthentication().getName();
        if (id.equals(refreshToken.getAuth().getId().toString())) refreshToken.setRevoked(true);
        Optional<Auth> optionalAuth = this.authRepository.findById(refreshToken.getAuth().getId());
        if (optionalAuth.isEmpty()) {
            throw new AppException(ErrorCode.AUTHENTICATION_FAILED);
        }
        var auth = optionalAuth.get();
        String newAccessToken = this.jwtService.generateAccessToken(auth);
        String newRefreshToken = this.jwtService.generateRefreshToken(auth);
        var newRefreshTokenEntity = this.refreshTokenRepository.save(RefreshToken.builder()
                .auth(auth)
                .token(newRefreshToken)
                .issueTime(this.jwtService.getIssuedAtDateFromToken(newRefreshToken))
                .expiryTime(this.jwtService.getExpirationDateFromToken(newRefreshToken))
                .build()
        );
        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .accessExpiresAt(this.jwtService.getExpirationDateFromToken(newAccessToken))
                .refreshExpiresAt(newRefreshTokenEntity.getExpiryTime())
                .accessIssuedAt(this.jwtService.getIssuedAtDateFromToken(newAccessToken))
                .refreshIssuedAt(newRefreshTokenEntity.getIssueTime())
                .accessExpirationTime(this.jwtService.getExpirationTimeFromToken(newAccessToken))
                .refreshExpirationTime(this.jwtService.getExpirationTimeFromToken(newRefreshToken))
                .build();
    }

    @Override
    public void logout(LogoutRequest logoutRequest) {
        if (!this.jwtService.validateToken(logoutRequest.getAccessToken())) {
            throw new AppException(ErrorCode.INVALID_ACCESS_TOKEN);
        }
        redisService.blackListAccessToken(logoutRequest.getAccessToken()
                , this.jwtService.getExpirationTimeFromToken(logoutRequest.getAccessToken())
        );
        var id = SecurityContextHolder.getContext().getAuthentication().getName();
        List<RefreshToken> listRefreshToken = this.refreshTokenRepository.findByAuthId(Long.valueOf(id));
        listRefreshToken.forEach(refreshToken -> refreshToken.setRevoked(true));
        this.refreshTokenRepository.saveAll(listRefreshToken);
    }

    @Override
    public IntrospectTokenResponse introspectToken(IntrospectTokenRequest request) {
        return IntrospectTokenResponse.builder()
                .result(this.jwtService.validateToken(request.getToken()))
                .build();
    }


    private void checkEmailPhone(String email, String phone) {
        if (this.authRepository.existsByEmailOrPhone(email, phone)) {
            throw new AppException(ErrorCode.EMAIL_OR_PHONE_EXISTS);
        }
    }

    @Override
    public void createAuthAdmin(Auth auth) {
        Optional<Auth> optionalAuth = this.authRepository.findByEmail(auth.getEmail());
        if (optionalAuth.isPresent()) {
            return;
        }
        Profile profile = Profile.builder()
                .fullName("Admin")
                .build();
        profile.setAuth(auth);
        auth.setProfile(profile);
        auth.setPasswordHash(bCryptPasswordEncoder.encode(auth.getPasswordHash()));
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.getRoleByName(Roles.ADMIN.name()));
        auth.setRoles(roles);
        authRepository.save(auth);
    }
}
