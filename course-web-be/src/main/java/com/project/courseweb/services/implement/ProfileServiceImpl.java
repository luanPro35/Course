package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.request.ProfileUpdateRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.ProfileUpdateResponse;
import com.project.courseweb.entities.Profile;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.ProfileMapper;
import com.project.courseweb.repositories.ProfileRepository;
import com.project.courseweb.services.FileUploadAWSService;
import com.project.courseweb.services.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileServiceImpl implements ProfileService {
    ProfileMapper profileMapper;
    ProfileRepository profileRepository;
    FileUploadAWSService fileUploadAWSService;

    @Override
    public ProfileUpdateResponse updateProfile(ProfileUpdateRequest updateRequest) {
        var idProfile = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Current user id is {}", idProfile);
        var profile = this.getProfileById(Long.valueOf(idProfile));
        this.profileMapper.updateProfile(profile, updateRequest);
        profile.setUpdateTime(LocalDateTime.now());
        this.profileRepository.save(profile);
        return this.profileMapper.toProfileUpdateResponse(profile);
    }

    @Override
    public ProfileUpdateResponse getProfile(Long userId) {
        Optional<Profile> optionalProfile = this.profileRepository.findById(userId);
        if (optionalProfile.isEmpty()) {
            return new ProfileUpdateResponse();
        }
        return this.profileMapper.toProfileUpdateResponse(optionalProfile.get());
    }

    @Override
    public FileResponse uploadAvatar(MultipartFile file) {
        var profile = this.getProfileById(this.getId());
        var url = this.fileUploadAWSService.uploadFile(profile,
                "avatar",
                file);
        profile.setAvatar(url);
        this.profileRepository.save(profile);
        return new FileResponse(url);
    }

    @Override
    public Profile getProfileById(Long id) {
        Optional<Profile> optionalProfile = this.profileRepository.findById(id);
        if (optionalProfile.isEmpty()) {
            throw new AppException(ErrorCode.PROFILE_NOT_FOUND);
        }
        return optionalProfile.get();
    }

    @Override
    public Long getId() {
        var id = SecurityContextHolder.getContext().getAuthentication().getName();
        return Long.valueOf(id);
    }
}
