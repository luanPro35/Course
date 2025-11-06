package com.project.courseweb.repositories;

import com.project.courseweb.entities.Category;

import java.util.Optional;

import com.project.courseweb.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(CategoryType slug);
}
