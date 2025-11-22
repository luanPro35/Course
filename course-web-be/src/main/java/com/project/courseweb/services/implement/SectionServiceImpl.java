package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.request.SectionCreateRequest;
import com.project.courseweb.dtos.response.SectionResponse;
import com.project.courseweb.services.SectionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class SectionServiceImpl implements SectionService {

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('UPLOAD_COURSE')")
    public SectionResponse createSection(SectionCreateRequest request) {
        return null;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EDIT_COURSE')")
    public SectionResponse updateSection() {
        return null;
    }

    @Override
    public SectionResponse getSectionById(Long id) {
        return null;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('DELETE_COURSE')")
    public void deleteSection(Long id) {
        
    }
}
