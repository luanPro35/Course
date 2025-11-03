package com.project.courseweb.entities.authentication;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true, length = 1000)
    String token;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "auth_id", nullable = false, referencedColumnName = "id")
    Auth auth;

    @Column(nullable = false, name = "issue_time")
    Date issueTime;

    @Column(nullable = false, name = "expiry_time")
    Date expiryTime;

    @Column(nullable = false)
    boolean revoked = false;
}