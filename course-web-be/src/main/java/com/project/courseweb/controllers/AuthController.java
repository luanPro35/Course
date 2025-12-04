package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.request.*;
import com.project.courseweb.dtos.response.AuthenticatedResponse;
import com.project.courseweb.dtos.response.IntrospectTokenResponse;
import com.project.courseweb.dtos.response.TokenResponse;
import com.project.courseweb.dtos.response.UserResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/auth")
public class AuthController {
    AuthService authService;

    @PostMapping("/register")
    ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreateRequest userCreateRequest) {
        return ApiResponse.ok(this.authService.createUser(userCreateRequest), SuccessCode.CREATED_USER_SUCCESS);
    }

    @PostMapping("/login")
    ApiResponse<AuthenticatedResponse> authenticated(@Valid @RequestBody AuthenticatedRequest authenticatedRequest) {
        return ApiResponse.ok(this.authService.authenticated(authenticatedRequest), SuccessCode.AUTHENTICATED_SUCCESS);
    }

    @PostMapping("/refresh-token")
    ApiResponse<TokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ApiResponse.ok(this.authService.refreshToken(refreshTokenRequest), SuccessCode.REFRESH_TOKEN_SUCCESS);
    }

    @PostMapping("/logout")
    ApiResponse<String> logout(@Valid @RequestBody LogoutRequest logoutRequest) {
        this.authService.logout(logoutRequest);
        return ApiResponse.ok(SuccessCode.LOGOUT_SUCCESS.getMessage(), SuccessCode.LOGOUT_SUCCESS);
    }

    @DeleteMapping
    ApiResponse<String> deleteAccount() {
        this.authService.deleteAccount();
        return ApiResponse.ok(null, SuccessCode.DELETE_ACCOUNT_SUCCESS);
    }

    @PostMapping("/forgot-password")
    ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        this.authService.forgotPassword(request);
        return ApiResponse.ok(null, SuccessCode.FORGOT_PASSWORD_SUCCESS);
    }

    @PostMapping("/reset-password")
    ApiResponse<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        this.authService.resetPassword(request);
        return ApiResponse.ok(null, SuccessCode.RESET_PASSWORD_SUCCESS);
    }


    @PostMapping("/introspect")
    ApiResponse<IntrospectTokenResponse> logout(@Valid @RequestBody IntrospectTokenRequest request) {
        return ApiResponse.ok(this.authService.introspectToken(request), SuccessCode.INTROSPECT_TOKEN_SUCCESS);
    }
}
