package com.project.courseweb.services.implement;


import com.project.courseweb.enums.CategoryType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.PostResponse;
import com.project.courseweb.entities.Post;
import com.project.courseweb.enums.PostStatus;
import com.project.courseweb.mappers.PostMapper;
import com.project.courseweb.repositories.PostRepository;
import com.project.courseweb.services.CategoryService;
import com.project.courseweb.services.FileUploadAWSService;
import com.project.courseweb.services.PostService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class PostServiceImpl implements PostService {

    PostRepository postRepository;
    FileUploadAWSService fileUploadAWSService;
    PostMapper postMapper;
    ProfileServiceImpl profileServiceImpl;
    CategoryService categoryService;

    @Override
    public FileResponse uploadPostThumbnail(MultipartFile file) {
        return FileResponse.builder()
                .url(this.fileUploadAWSService.uploadFile(
                        this.profileServiceImpl.getProfileById(Long.valueOf(getAuthId())),
                        "post-thumbnail",
                        file
                        )
                )
                .build();
    }
    @Override
    public PostResponse createPost(PostRequest request) {
        Post post = this.postMapper.toPostEntity(request);
        post.setProfile(this.profileServiceImpl.getProfileById(Long.valueOf(this.getAuthId())));
        post.setStatus(PostStatus.valueOf(request.getStatusPost()));
        post.setCategory(this.categoryService.getCategoryByName(CategoryType.valueOf(request.getCategory())));
        var entity = this.postRepository.save(post);
        var response = this.postMapper.toPostResponse(post);
        response.setCategory(entity.getCategory().getSlug().name());
        response.setStatusPost(entity.getStatus().name());
        return response;
    }

    private String getAuthId(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
