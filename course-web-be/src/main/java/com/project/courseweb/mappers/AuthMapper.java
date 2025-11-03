package com.project.courseweb.mappers;

import com.project.courseweb.dtos.response.UserResponse;
import com.project.courseweb.dtos.request.UserCreateRequest;
import com.project.courseweb.entities.authentication.Auth;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    @Mapping(target = "fullName", source = "profile.fullName")
    UserResponse toUserResponse(Auth auth);
    @Mapping(target = "profile.fullName", source = "fullName")
    @Mapping(target = "passwordHash", source = "passWord")
    Auth toAuth(UserCreateRequest userCreateRequest);
}
