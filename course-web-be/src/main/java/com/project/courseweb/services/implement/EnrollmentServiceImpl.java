package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.response.CourseEnrollmentResponse;
import com.project.courseweb.dtos.response.EnrollmentResponse;
import com.project.courseweb.entities.Course;
import com.project.courseweb.entities.Enrollment;
import com.project.courseweb.entities.Profile;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.EnrollmentMapper;
import com.project.courseweb.repositories.CourseRepository;
import com.project.courseweb.repositories.EnrollmentRepository;
import com.project.courseweb.services.CourseService;
import com.project.courseweb.services.EnrollmentService;
import com.project.courseweb.services.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentServiceImpl implements EnrollmentService {
    EnrollmentRepository enrollmentRepository;
    EnrollmentMapper enrollmentMapper;
    ProfileService profileService;
    CourseService courseService;
    CourseRepository courseRepository;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ENROLL_COURSE')")
    public EnrollmentResponse enrollInFreeCourse(Long courseId) {
        var profile = this.profileService.getProfileById(profileService.getId());

        if (enrollmentRepository.existsByProfileIdAndCourseId(profile.getId(), courseId)) {
            throw new AppException(ErrorCode.ALREADY_ENROLLED);
        }

        var course = this.courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        if (course.getPrice() != null && course.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0) {
            throw new AppException(ErrorCode.COURSE_IS_NOT_FREE);
        }

        var enrollment = Enrollment.builder()
                .profile(profile)
                .course(course)
                .build();

        return this.enrollmentMapper.toResponse(enrollmentRepository.save(enrollment));
    }

    @Override
    public void enrollInCourseVip(Course course, Profile profile) {
        this.enrollmentRepository.save(
                Enrollment.builder()
                        .profile(profile)
                        .course(course)
                        .build()
        );
    }

    @Override
    public PageResponse<CourseEnrollmentResponse> getListCourseEnrollment(Pageable pageable) {
        Page<Enrollment> enrollments = this.enrollmentRepository.findAllByProfileId(this.profileService.getId(), pageable);
        List<CourseEnrollmentResponse> courseEnrollmentResponses = enrollments.stream()
                .map(enrollment -> {
                    var course = enrollment.getCourse();
                    return CourseEnrollmentResponse.builder()
                            .courseID(course.getId())
                            .title(course.getTitle())
                            .thumbnail(course.getThumbnailUrl())
                            .build();
                }).toList();
        return PageResponse.<CourseEnrollmentResponse>builder()
                .content(courseEnrollmentResponses)
                .pageNo(enrollments.getNumber())
                .pageSize(enrollments.getSize())
                .totalElements(enrollments.getTotalElements())
                .totalPages(enrollments.getTotalPages())
                .last(enrollments.isLast())
                .build();
    }
}
