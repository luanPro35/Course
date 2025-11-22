package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.response.EnrollmentResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/enrollments")
public class EnrollmentController {
    EnrollmentService enrollmentService;

    @PostMapping("/free/{courseId}")
    ApiResponse<EnrollmentResponse> enrollInFreeCourse(@PathVariable Long courseId) {
        return ApiResponse.ok(this.enrollmentService.enrollInFreeCourse(courseId), SuccessCode.ENROLL_COURSE_SUCCESS);
    }
}
