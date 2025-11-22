package com.project.courseweb.repositories;

import com.project.courseweb.entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment,Long> {
    boolean existsByProfileIdAndCourseId(Long profileId, Long courseId);
}
