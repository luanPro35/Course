package com.project.courseweb.services;

import com.project.courseweb.dtos.response.EnrollmentResponse;
import org.springframework.stereotype.Service;

@Service
public interface EnrollmentService {
    EnrollmentResponse enrollInFreeCourse(Long courseId);
}
