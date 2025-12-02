package com.project.courseweb.services;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.response.UserResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    PageResponse<UserResponse> getUserList(Pageable pageable);

    void deleteUser(Long id);
//    UserResponse provideRole()
}
