package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileUpdateResponse {
    Long id;
    //profile basic
    String fullName;
    String about;
    String avatar;
    //profile social
    String personalWebsite;
    String github;
    String linkedin;
    String facebook;
    String youtube;
}
