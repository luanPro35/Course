package com.project.courseweb.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "lessons")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String title;
    String thumbnailUrl;
    @Column(columnDefinition = "int default 0", nullable = false)
    int durationInMinutes;
    @Column(columnDefinition = "int default 0", nullable = false)
    int orderIndex;
    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    Section section;
}
