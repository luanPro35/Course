package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.*;
import com.project.courseweb.dtos.response.CourseLabelResponse;
import com.project.courseweb.dtos.response.CourseResponse;
import com.project.courseweb.entities.Course;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        if (request.getSections() != null) {
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
        }
        courseRepository.save(course);
        return this.courseMapper.toResponse(course);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or (hasAuthority('EDIT_COURSE') and @courseServiceImpl.isOwn(#id))")
    public CourseResponse updateCourseInfo(Long id, CourseUpdateRequest request) {
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        courseMapper.updateCourse(course, request);
        return courseMapper.toResponse(courseRepository.save(course));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or (hasAuthority('EDIT_COURSE') and @courseServiceImpl.isOwn(#id))")
    public CourseResponse updateCourseIngredient(Long id, CourseIngredientUpdateRequest request) {
        //
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        //
        courseMapper.updateCourseIngredient(course, request);
        //
        course.getSections().clear();
        if (request.getSections() != null) {
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
        }
        return courseMapper.toResponse(courseRepository.save(course));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or (hasAuthority('EDIT_COURSE') and @courseServiceImpl.isOwn(#id))")
    public CourseResponse updateStatusCourse(Long id, String status) {
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        course.setStatus(CourseStatus.valueOf(status.toUpperCase()));
        return courseMapper.toResponse(courseRepository.save(course));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or @courseServiceImpl.isOwn(#id)")
    public PageResponse<CourseLabelResponse> getCoursesByStatus(String status, Pageable pageable) {
        Page<Course> courses = courseRepository.getCoursesByStatus(CourseStatus.valueOf(status), pageable);
        return this.toPageResponse(courses);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public CourseResponse getCourseById(Long id) {
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        return courseMapper.toResponse(course);
    }

    @Override
    public CourseResponse getPublishedCourseById(Long id) {
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if (course.getStatus() != CourseStatus.PUBLISHED) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        return courseMapper.toResponse(course);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or (hasAuthority('DELETE_COURSE') and @courseServiceImpl.isOwn(#id))")
    public void deleteCourse(Long id) {
        var course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        courseRepository.delete(course);
    }

    @Override
    public PageResponse<CourseLabelResponse> getCoursesByStatusPublished(Pageable pageable) {
        Page<Course> courses = this.courseRepository.getCoursesByStatus(CourseStatus.PUBLISHED, pageable);
        return this.toPageResponse(courses);
    }

    @Override
    public Course findCourseById(Long id) {
        return this.courseRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<CourseLabelResponse> getAllCourses(Pageable pageable) {
        Page<Course> courses = courseRepository.findAll(pageable);
        return this.toPageResponse(courses);
    }


    public boolean isOwn(Long id) {
        var profileId = SecurityContextHolder.getContext().getAuthentication().getName();
        return courseRepository.existsByIdAndCreatorId(id, Long.valueOf(profileId));
    }

    private PageResponse<CourseLabelResponse> toPageResponse(Page<Course> page) {
        var content = page.stream().map(this.courseMapper::toLabelResponse).toList();
        return PageResponse.<CourseLabelResponse>builder()
                .content(content)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
