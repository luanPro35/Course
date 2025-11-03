package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticatedResponse {
    UserResponse user;
    TokenResponse token;
}
