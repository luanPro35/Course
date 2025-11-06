package com.project.courseweb.services;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.PostResponse;


@Service
public interface PostService {
    FileResponse uploadPostThumbnail(MultipartFile file);

    PostResponse createPost(PostRequest request);
}
