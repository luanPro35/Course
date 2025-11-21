package com.project.courseweb.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    EMAIL_OR_PHONE_EXISTS(400, "Email or Phone already exists", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR(400, "Validation error", HttpStatus.BAD_REQUEST),
    GENERATED_TOKEN_FAILED(401, "Generated token faild", HttpStatus.BAD_REQUEST),
    VERIFY_TOKEN_FAILED(402, "Verify token faild", HttpStatus.BAD_REQUEST),
    AUTHENTICATION_FAILED(207, "Authentication failed", HttpStatus.UNAUTHORIZED),
    INVALID_KEY(403, "Invalid key", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_NOT_FOUND(404, "Refresh token not found", HttpStatus.NOT_FOUND),
    REFRESH_TOKEN_EXPIRED(405, "Refresh token expired", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_FAILED(406, "Refresh token was used or expired", HttpStatus.UNAUTHORIZED),
    INVALID_ACCESS_TOKEN(407, "Invalid access token", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(408, "Unauthorized", HttpStatus.UNAUTHORIZED),
    PROFILE_NOT_FOUND(409, "Profile not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(410, "Category not found", HttpStatus.NOT_FOUND),
    UPLOAD_FILE_FAILED(411, "Upload file failed", HttpStatus.INTERNAL_SERVER_ERROR),
    POST_NOT_FOUND(412, "Post not found", HttpStatus.NOT_FOUND),
    COURSE_NOT_FOUND(413, "Course not found", HttpStatus.NOT_FOUND);

    int status;
    String message;
    HttpStatus httpStatus;

    ErrorCode(int status, String message, HttpStatus httpStatus) {
        this.status = status;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
