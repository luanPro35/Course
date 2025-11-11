package com.project.courseweb.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "sections")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String title;
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    Course course;
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    List<Lesson> lessons;
    @Column(columnDefinition = "int default 0", nullable = false)
    int orderIndex;
}
