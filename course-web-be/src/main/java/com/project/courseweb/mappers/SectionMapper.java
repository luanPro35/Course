package com.project.courseweb.mappers;

import com.project.courseweb.dtos.request.SectionCreateRequest;
import com.project.courseweb.dtos.response.SectionResponse;
import com.project.courseweb.entities.Section;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SectionMapper {
    SectionResponse toResponse(Section section);

    Section toEntity(SectionCreateRequest request);
}
