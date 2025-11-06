package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.request.ProfileUpdateRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.ProfileUpdateResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @PutMapping("/update")
    ApiResponse<ProfileUpdateResponse> updateProfile(@RequestBody ProfileUpdateRequest updateRequest) {
        return ApiResponse.ok(this.profileService.updateProfile(updateRequest), SuccessCode.UPDATE_PROFILE_SUCCESS);
    }

    @PatchMapping("/update-avatar")
    ApiResponse<FileResponse> updateAvatar(@RequestParam("file") MultipartFile file) {
        return ApiResponse.ok(this.profileService.uploadAvatar(file), SuccessCode.UPDATE_AVATAR_SUCCESS);
    }
}
