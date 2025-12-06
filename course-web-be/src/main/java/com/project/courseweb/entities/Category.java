package com.project.courseweb.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

import com.project.courseweb.enums.CategoryType;

@Entity
@Table(name = "categories")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(unique = true, nullable = false)
    @Enumerated(EnumType.STRING)
    CategoryType slug;
    @OneToMany(mappedBy = "category")
    Set<Post> posts;
}
