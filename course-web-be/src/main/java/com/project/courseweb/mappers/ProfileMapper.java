package com.project.courseweb.mappers;

import com.project.courseweb.dtos.request.ProfileUpdateRequest;
import com.project.courseweb.dtos.response.ProfileUpdateResponse;
import com.project.courseweb.entities.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @Mapping(target = "avatar", ignore = true)
    void updateProfile(@MappingTarget Profile profile, ProfileUpdateRequest updateRequest);
    ProfileUpdateResponse toProfileUpdateResponse(Profile profile);
}
