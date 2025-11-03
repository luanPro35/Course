package com.project.courseweb.entities;

import com.project.courseweb.entities.authentication.Auth;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @OneToOne(mappedBy = "profile")
    Auth auth;
    String fullName;
    String avatar;

    @Lob
    String about;
    String personalWebsite;
    String github;
    String linkedin;
    String facebook;
    String youtube;

    LocalDateTime createTime;
    LocalDateTime updateTime;

    @PrePersist
    public void prePersist() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }
}
