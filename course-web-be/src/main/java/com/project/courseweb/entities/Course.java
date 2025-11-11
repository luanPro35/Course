package com.project.courseweb.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.project.courseweb.enums.CourseStatus;

@Entity
@Table(name = "courses")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String title;
    String thumbnailUrl;
    @Lob
    String description;
    BigDecimal price;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    CourseStatus status;
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    List<Section> sections;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
