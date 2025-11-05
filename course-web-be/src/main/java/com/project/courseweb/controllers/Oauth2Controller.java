package com.project.courseweb.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.response.AuthenticatedResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.AuthService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/oauth2")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class Oauth2Controller {
    AuthService authService;
    
    @PostMapping("/callback")
    ApiResponse<AuthenticatedResponse> postMethodName(@RequestParam("code") String code) {
        return ApiResponse.ok(this.authService.authenticatedUserGoogle(code), SuccessCode.)
    }
}
