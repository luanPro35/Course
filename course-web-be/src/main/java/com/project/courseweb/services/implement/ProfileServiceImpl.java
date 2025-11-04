package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.request.ProfileUpdateRequest;
import com.project.courseweb.dtos.response.ProfileUpdateResponse;
import com.project.courseweb.entities.Profile;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.ProfileMapper;
import com.project.courseweb.repositories.ProfileRepository;
import com.project.courseweb.services.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileServiceImpl implements ProfileService {
    ProfileMapper profileMapper;
    ProfileRepository profileRepository;

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
    protected Profile getProfileById(Long id){
        Optional<Profile> optionalProfile = this.profileRepository.findById(id);
        if (optionalProfile.isEmpty()) {
            throw new AppException(ErrorCode.PROFILE_NOT_FOUND);
        }
        return optionalProfile.get();
    }
}