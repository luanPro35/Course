package com.project.courseweb.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum SuccessCode {
    SUCCESS(200, "Success", HttpStatus.OK)
    ;
    int status;
    String message;
    HttpStatus httpStatus;
}

