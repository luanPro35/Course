package com.project.courseweb.mappers;

import com.project.courseweb.dtos.request.UserCreateRequest;
import com.project.courseweb.dtos.response.UserResponse;
import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.entities.authentication.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    @Mapping(target = "fullName", source = "profile.fullName")
    @Mapping(target = "avatar", source = "profile.avatar")
    @Mapping(target = "createdAt", source = "profile.createTime")
    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRoles")
    @Mapping(target = "enrolledCourses", ignore = true)
    UserResponse toUserResponse(Auth auth);

    @Mapping(target = "profile.fullName", source = "fullName")
    @Mapping(target = "passwordHash", source = "passWord")
    Auth toAuth(UserCreateRequest userCreateRequest);

    @Named("mapRoles")
    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) return null;
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
}
