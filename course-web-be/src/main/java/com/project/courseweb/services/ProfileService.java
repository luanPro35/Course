package com.project.courseweb.services;

import com.project.courseweb.dtos.request.ProfileUpdateRequest;
import com.project.courseweb.dtos.response.ProfileUpdateResponse;
import org.springframework.stereotype.Service;

@Service
public interface ProfileService {
    ProfileUpdateResponse updateProfile(ProfileUpdateRequest updateRequest);
}