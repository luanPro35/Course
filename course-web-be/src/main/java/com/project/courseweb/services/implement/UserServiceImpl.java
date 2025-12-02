package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.response.UserResponse;
import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.Roles;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.AuthMapper;
import com.project.courseweb.repositories.AuthRepository;
import com.project.courseweb.repositories.RefreshTokenRepository;
import com.project.courseweb.services.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    AuthRepository authRepository;
    AuthMapper authMapper;
    RefreshTokenRepository refreshTokenRepository;

    @Override
    public PageResponse<UserResponse> getUserList(Pageable pageable) {
        return this.toPageResponse(
                this.authRepository.findAllByRoles_Name(Roles.USER.name(), pageable)
        );
    }

    @Transactional
    @Override
    public void deleteUser(Long id) {
        var user = this.authRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
        refreshTokenRepository.deleteByAuthId(id);
        this.authRepository.delete(user);
    }

    private PageResponse<UserResponse> toPageResponse(Page<Auth> page) {
        var content = page.stream().map(authMapper::toUserResponse).toList();
        return PageResponse.<UserResponse>builder()
                .content(content)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
