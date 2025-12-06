package com.project.courseweb.services.implement;


import com.project.courseweb.dtos.request.LessonCreateRequest;
import com.project.courseweb.dtos.response.LessonResponse;
import com.project.courseweb.services.LessonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class LessonServiceImpl implements LessonService {

    @Override
    public LessonResponse createLesson(LessonCreateRequest request) {
        return null;
    }

    @Override
    public LessonResponse updateLesson() {
        return null;
    }

    @Override
    public LessonResponse getLessonById(Long id) {
        return null;
    }

    @Override
    public void deleteLesson(Long id) {

    }
}
