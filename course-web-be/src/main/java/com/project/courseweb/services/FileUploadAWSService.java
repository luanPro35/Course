package com.project.courseweb.services;

import com.project.courseweb.entities.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface FileUploadAWSService {
    String uploadFile(Profile profile, String nameFolder, MultipartFile file);

    void deleteFile(String url);
}
