package com.project.courseweb.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    VALIDATION_ERROR(400, "Validation error", HttpStatus.BAD_REQUEST),
    GENERATED_TOKEN_FAILDD(400, "Generated token faild", HttpStatus.BAD_REQUEST),
    VERIFY_TOKEN_FAILED(400, "Verify token faild", HttpStatus.BAD_REQUEST),
    AUTHENTICATION_FAILED(207, "Authentication failed", HttpStatus.UNAUTHORIZED),
    ;
    int status;
    String message;
    HttpStatus httpStatus;
}
