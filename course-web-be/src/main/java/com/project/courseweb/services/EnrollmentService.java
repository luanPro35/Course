package com.project.courseweb.services;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.response.CourseEnrollmentResponse;
import com.project.courseweb.dtos.response.EnrollmentResponse;
import com.project.courseweb.entities.Course;
import com.project.courseweb.entities.Profile;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface EnrollmentService {
    EnrollmentResponse enrollInFreeCourse(Long courseId);

    void enrollInCourseVip(Course course, Profile profile);

    PageResponse<CourseEnrollmentResponse> getListCourseEnrollment(Pageable pageable);
}
