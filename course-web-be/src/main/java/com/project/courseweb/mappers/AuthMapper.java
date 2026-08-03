package com.project.courseweb.mappers;

import com.project.courseweb.dtos.request.UserCreateRequest;
import com.project.courseweb.dtos.response.UserDashboardResponse;
import com.project.courseweb.dtos.response.UserResponse;
import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.entities.authentication.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    @Mapping(target = "fullName", source = "profile.fullName")
    @Mapping(target = "roles", source = "auth.roles")
    @Mapping(target = "avatar", source = "profile.avatar")
    UserResponse toUserResponse(Auth auth);

    @Mapping(target = "profile.fullName", source = "fullName")
    @Mapping(target = "passwordHash", source = "passWord")
    Auth toAuth(UserCreateRequest userCreateRequest);

    @Mapping(target = "fullName", source = "profile.fullName")
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "avatar", source = "profile.avatar")
    @Mapping(target = "createdAt", source = "profile.createTime")
    @Mapping(target = "enrolledCourses", ignore = true)
    UserDashboardResponse toUserDashboardResponse(Auth auth);

    default String mapRoleToString(Role role) {
        return role.getName();
    }
}
