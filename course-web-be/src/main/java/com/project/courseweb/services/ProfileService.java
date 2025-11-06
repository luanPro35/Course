package com.project.courseweb.services;

import com.project.courseweb.dtos.request.ProfileUpdateRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.ProfileUpdateResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface ProfileService {
    ProfileUpdateResponse updateProfile(ProfileUpdateRequest updateRequest);

    FileResponse uploadAvatar(MultipartFile file);
}