package com.project.courseweb.services;

import com.project.courseweb.dtos.request.ProfileUpdateRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.ProfileUpdateResponse;
import com.project.courseweb.entities.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface ProfileService {
    ProfileUpdateResponse updateProfile(ProfileUpdateRequest updateRequest);

    FileResponse uploadAvatar(MultipartFile file);

    ProfileUpdateResponse getProfile(Long userId);

    Profile getProfileById(Long id);

    Long getId();
}