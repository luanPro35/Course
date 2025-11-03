package com.project.courseweb.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum SuccessCode {
    CREATED_USER_SUCCESS(201, "Tạo thành công người dùng", HttpStatus.CREATED),
    AUTHENTICATED_SUCCESS(200, "Đăng nhập thành công", HttpStatus.OK),
    REFRESH_TOKEN_SUCCESS(200, "Refresh token thành công", HttpStatus.OK),
    LOGOUT_SUCCESS(200, "Đăng xuất thành công", HttpStatus.OK),
    INTROSPECT_TOKEN_SUCCESS(200, "Introspect token thành công", HttpStatus.OK);

    int status;
    String message;
    HttpStatus httpStatus;

    SuccessCode(int status, String message, HttpStatus httpStatus) {
        this.status = status;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}

