package com.project.courseweb.services;

import com.project.courseweb.dtos.request.*;
import com.project.courseweb.dtos.response.AuthenticatedResponse;
import com.project.courseweb.dtos.response.IntrospectTokenResponse;
import com.project.courseweb.dtos.response.TokenResponse;
import com.project.courseweb.dtos.response.UserResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    UserResponse createUser(UserCreateRequest userCreateRequest);

    AuthenticatedResponse authenticated(AuthenticatedRequest authenticatedRequest);

    TokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    void logout(LogoutRequest logoutRequest);

    IntrospectTokenResponse introspectToken(IntrospectTokenRequest request);
}
