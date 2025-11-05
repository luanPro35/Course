package com.project.courseweb.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class AuthenticatedRequest {
    @Email
    String email;
    @Size(min = 8, message = "Password must be at least {min} characters")
    String password;
}
