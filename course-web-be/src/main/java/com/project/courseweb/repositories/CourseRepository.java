package com.project.courseweb.repositories;

import com.project.courseweb.entities.Course;
import com.project.courseweb.enums.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByIdAndCreatorId(Long id, Long creatorId);

    Page<Course> getCoursesByStatus(CourseStatus status, Pageable pageable);
    
    long countByStatus(CourseStatus status);
}
