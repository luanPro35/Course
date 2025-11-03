package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenResponse {
    String accessToken;
    String refreshToken;
    Date accessExpiresAt;
    Date refreshExpiresAt;
    Date accessIssuedAt;
    Date refreshIssuedAt;
    long accessExpirationTime;
    long refreshExpirationTime;
}
