package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.response.UserDashboardResponse;
import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.Roles;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.AuthMapper;
import com.project.courseweb.mappers.EnrollmentMapper;
import com.project.courseweb.repositories.AuthRepository;
import com.project.courseweb.repositories.RefreshTokenRepository;
import com.project.courseweb.services.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    AuthRepository authRepository;
    AuthMapper authMapper;
    ProfileServiceImpl profileServiceImpl;
    RefreshTokenRepository refreshTokenRepository;
    EnrollmentMapper enrollmentMapper;

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<UserDashboardResponse> getUserList(Pageable pageable) {
        return this.toPageResponse(
                this.authRepository.findAllByRoles_Name(Roles.USER.name(), pageable)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Override
    public void deleteUser(Long id) {
        var user = this.authRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
        refreshTokenRepository.deleteByAuthId(id);
        this.authRepository.delete(user);
    }

    private PageResponse<UserDashboardResponse> toPageResponse(Page<Auth> page) {
        var content = page.stream().map(this::toUserDashboardResponse).toList();
        return PageResponse.<UserDashboardResponse>builder()
                .content(content)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private UserDashboardResponse toUserDashboardResponse(Auth auth) {
        var response = this.authMapper.toUserDashboardResponse(auth);
        response.setEnrolledCourses(
                auth.getProfile().getEnrollments().stream().map(
                                enrollmentMapper::toEnrolledCourseResponse)
                        .collect(Collectors.toSet())
        );
        return response;
    }
}
