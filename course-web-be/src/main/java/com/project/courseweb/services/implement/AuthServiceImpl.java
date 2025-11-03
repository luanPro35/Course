package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.request.*;
import com.project.courseweb.dtos.response.AuthenticatedResponse;
import com.project.courseweb.dtos.response.IntrospectTokenResponse;
import com.project.courseweb.dtos.response.TokenResponse;
import com.project.courseweb.dtos.response.UserResponse;
import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.entities.authentication.RefreshToken;
import com.project.courseweb.entities.authentication.Role;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.Roles;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.AuthMapper;
import com.project.courseweb.repositories.AuthRepository;
import com.project.courseweb.repositories.RefreshTokenRepository;
import com.project.courseweb.services.AuthService;
import com.project.courseweb.services.JwtService;
import com.project.courseweb.services.RedisService;
import com.project.courseweb.services.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

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
    RedisService redisService;

    @Override
    public UserResponse createUser(UserCreateRequest userCreateRequest) {
        this.checkEmailPhone(userCreateRequest.getEmail(),  userCreateRequest.getPhone());
        var auth = authMapper.toAuth(userCreateRequest);
        auth.setPasswordHash(bCryptPasswordEncoder.encode(userCreateRequest.getPassWord()));
        auth.getProfile().setAuth(auth);
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.getRoleByName(Roles.USER.name()));
        auth.setRoles(roles);
        authRepository.save(auth);
        return authMapper.toUserResponse(auth);
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
    public TokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        Optional<RefreshToken> optionalRefreshToken = this.refreshTokenRepository
                .findByToken(refreshTokenRequest.getRefreshToken());
        if (optionalRefreshToken.isEmpty()) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        RefreshToken refreshToken = optionalRefreshToken.get();
        if(this.jwtService.validateToken(refreshToken.getToken()) && refreshToken.isRevoked()) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_FAILED);
        }
        var id = SecurityContextHolder.getContext().getAuthentication().getName();
        if(id.equals(refreshToken.getAuth().getId().toString())) refreshToken.setRevoked(true);
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


    private void checkEmailPhone(String email, String phone){
        if (this.authRepository.existsByEmailOrPhone(email, phone)) {
            throw new AppException(ErrorCode.EMAIL_OR_PHONE_EXISTS);
        }
    }
}
