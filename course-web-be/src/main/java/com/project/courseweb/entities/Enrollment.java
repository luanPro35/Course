package com.project.courseweb.entities;

import com.project.courseweb.entities.authentication.Auth;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "auth_id", nullable = false)
    Auth auth;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    LocalDateTime enrollmentDate;

    @PrePersist
    protected void onCreate() {
        enrollmentDate = LocalDateTime.now();
    }
}
