package com.project.courseweb.services;

import com.project.courseweb.dtos.request.LessonCreateRequest;
import com.project.courseweb.dtos.response.LessonResponse;
import org.springframework.stereotype.Service;

@Service
public interface LessonService {
    LessonResponse createLesson(LessonCreateRequest request);

    LessonResponse updateLesson();

    LessonResponse getLessonById(Long id);

    void deleteLesson(Long id);
}
