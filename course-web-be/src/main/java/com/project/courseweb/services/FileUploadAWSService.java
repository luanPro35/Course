package com.project.courseweb.services;

import com.project.courseweb.dtos.response.FileResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface FileUploadAWSService   {
    FileResponse uploadAvatar(MultipartFile file);
}
