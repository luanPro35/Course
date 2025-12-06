package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.entities.Profile;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.repositories.ProfileRepository;
import com.project.courseweb.services.FileUploadAWSService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Component
public class FileUploadAWSServiceImpl implements FileUploadAWSService {
    ProfileRepository profileRepository;
    S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    @NonFinal
    String bucketName;

    @Value("${aws.region}")
    @NonFinal
    String awsRegion;


    @Override
    public String uploadFile(Profile profile, String nameFolder, MultipartFile file) {
        String objKey = profile.getId().toString() + "/"+nameFolder+"/" + UUID.randomUUID()
                + "-" +file.getOriginalFilename();
        try {
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(objKey)
                            .contentType(file.getContentType())
                            .build()
                    , RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, awsRegion, objKey);
        } catch (IOException e) {
            throw new AppException(ErrorCode.UPLOAD_FILE_FAILED);
        }
    }
}
