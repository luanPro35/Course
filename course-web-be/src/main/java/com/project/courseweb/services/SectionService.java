package com.project.courseweb.services;

import com.project.courseweb.dtos.request.SectionCreateRequest;
import com.project.courseweb.dtos.response.SectionResponse;
import org.springframework.stereotype.Service;

@Service
public interface SectionService {
    SectionResponse createSection(SectionCreateRequest request);

    SectionResponse updateSection();

    SectionResponse getSectionById(Long id);

    void deleteSection(Long id);
}
