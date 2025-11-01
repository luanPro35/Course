package com.project.courseweb.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
    @Size(min = 4, message = "Username must be at least {min} characters")
    String fullName;
    @NotBlank
    @Email
    String email;
    String phone;
    @Size(min = 8, message = "Password must be at least {min} characters")
    String passWord;
}
