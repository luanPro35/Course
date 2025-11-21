package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.request.CourseCreateRequest;
import com.project.courseweb.dtos.request.LessonCreateRequest;
import com.project.courseweb.dtos.request.SectionCreateRequest;
import com.project.courseweb.dtos.response.CourseResponse;
import com.project.courseweb.enums.CourseStatus;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.CourseMapper;
import com.project.courseweb.mappers.LessonMapper;
import com.project.courseweb.mappers.SectionMapper;
import com.project.courseweb.repositories.CourseRepository;
import com.project.courseweb.services.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseServiceImpl implements CourseService {
    CourseRepository courseRepository;
    CourseMapper courseMapper;
    SectionMapper sectionMapper;
    LessonMapper lessonMapper;
    ProfileServiceImpl profileService;

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('UPLOAD_COURSE')")
    @Transactional
    @Override
    public CourseResponse createCourse(CourseCreateRequest request) {
        //1. Created obj Course
        var course = this.courseMapper.toEntity(request);
        course.setSections(new ArrayList<>());
        var profile = this.profileService.getProfileById(profileService.getId());
        course.setCreator(profile);
        //
        for (SectionCreateRequest sectionRequest : request.getSections()) {
            var section = this.sectionMapper.toEntity(sectionRequest);
            section.setLessons(new ArrayList<>());
            section.setCourse(course);
            if (sectionRequest.getLessons() != null) {
                for (LessonCreateRequest lessonRequest : sectionRequest.getLessons()) {
                    var lesson = this.lessonMapper.toEntity(lessonRequest);
                    lesson.setSection(section);

                    section.getLessons().add(lesson);
                }
            }
            course.getSections().add(section);
        }
        courseRepository.save(course);
        return this.courseMapper.toResponse(course);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public CourseResponse getCourseById(Long id) {
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        return courseMapper.toResponse(course);
    }

    @Override
    @PreAuthorize("hasAuthority('VIEW_COURSE')")
    public CourseResponse getPublishedCourseById(Long id) {
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if (course.getStatus() != CourseStatus.PUBLISHED) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        return courseMapper.toResponse(course);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('DELETE_COURSE')")
    public void deleteCourse(Long id) {
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        courseRepository.delete(course);
    }

    public boolean isOwn(Long id) {
        var profileId = SecurityContextHolder.getContext().getAuthentication().getName();
        return courseRepository.existsByIdAndCreatorId(id, Long.valueOf(profileId));
    }
}
