package com.project.courseweb.services;

import com.project.courseweb.dtos.response.EnrollmentResponse;
import com.project.courseweb.entities.Course;
import com.project.courseweb.entities.Profile;
import org.springframework.stereotype.Service;

@Service
public interface EnrollmentService {
    EnrollmentResponse enrollInFreeCourse(Long courseId);

    void enrollInCourseVip(Course course, Profile profile);
}
