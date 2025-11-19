package com.project.courseweb.services.implement;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.PostResponse;
import com.project.courseweb.entities.Post;
import com.project.courseweb.enums.CategoryType;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.PostStatus;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.PostMapper;
import com.project.courseweb.repositories.PostRepository;
import com.project.courseweb.services.CategoryService;
import com.project.courseweb.services.FileUploadAWSService;
import com.project.courseweb.services.PostService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

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
                        this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId()),
                        "post-thumbnail",
                        file
                        )
                )
                .build();
    }
    @Override
    @Transactional
    public PostResponse createPost(PostRequest request) {
        Post post = this.postMapper.toPostEntity(request);
        post.setProfile(this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId()));
        try {
            post.setStatus(PostStatus.valueOf(request.getStatusPost()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + request.getStatusPost());
        }
        try {
            CategoryType categoryType = CategoryType.valueOf(request.getCategory());
            post.setCategory(this.categoryService.getCategoryByName(categoryType));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid category: " + request.getCategory());
        }
        var entity = this.postRepository.save(post);
        var response = this.postMapper.toPostResponse(post);
        response.setCategory(entity.getCategory().getSlug().name());
        response.setStatusPost(entity.getStatus().name());
        return response;
    }
    @Override
    public PageResponse<PostResponse> getPostsByStatus(Pageable pageable, String status) {
        var profile = this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId());
        Page<Post> posts = this.postRepository.getPostsByStatusAndProfileId(PostStatus.valueOf(status), profile.getId(), pageable);
        List<PostResponse> postResponses = posts.stream().map(
            post -> {
                var response = this.postMapper.toPostResponse(post);
                response.setCategory(post.getCategory().getSlug().name());
                response.setStatusPost(post.getStatus().name());
                return response;
            }
        ).toList();
        return PageResponse.<PostResponse>builder()
                .content(postResponses)
                .pageNo(posts.getNumber())
                .pageSize(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .last(posts.isLast())
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long id) {
        var profile = this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId());
        var postOptional = this.postRepository.getPostByIdAndProfileId(id, profile.getId());
        if(postOptional.isEmpty()){
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
        var post = postOptional.get();
        var response = this.postMapper.toPostResponse(post);
        response.setCategory(post.getCategory().getSlug().name()); 
        response.setStatusPost(post.getStatus().name());
        return response;
    }
    @Override
    @Transactional
    public PostResponse updatePost(Long id, PostRequest request) {
        var profile = this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId());
        var postOptional = this.postRepository.getPostByIdAndProfileId(id, profile.getId());
        if(!postOptional.isPresent()){
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }   
        var post = postOptional.get();
        post.setCreatedAt(LocalDateTime.now());
        try {
            CategoryType categoryType = CategoryType.valueOf(request.getCategory());
            post.setCategory(this.categoryService.getCategoryByName(categoryType));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid category: " + request.getCategory());
        }
        try {
            post.setStatus(PostStatus.valueOf(request.getStatusPost()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + request.getStatusPost());
        }
        this.postMapper.updatePostFromRequest(request, post);
        var response = this.postMapper.toPostResponse(this.postRepository.save(post));
        response.setCategory(post.getCategory().getSlug().name());
        response.setStatusPost(post.getStatus().name());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getPostsByStatusPending(Pageable pageable) {
        Page<Post> posts = this.postRepository.getPostsByStatus(PostStatus.PENDING, pageable);
        List<PostResponse> postResponses = posts.stream().map(
            post -> {
                var response = this.postMapper.toPostResponse(post);
                response.setCategory(post.getCategory().getSlug().name());
                response.setStatusPost(post.getStatus().name());
                return response;
            }
        ).toList();
        return PageResponse.<PostResponse>builder()
                .content(postResponses)
                .pageNo(posts.getNumber())
                .pageSize(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .last(posts.isLast())
                .build();
    }
    @Override
    public PageResponse<PostResponse> getAllPostsByStatusPublished(Pageable pageable) {
        Page<Post> posts = this.postRepository.getPostsByStatus(PostStatus.PUBLISHED, pageable);
        List<PostResponse> postResponses = posts.stream().map(
            post -> {
                var response = this.postMapper.toPostResponse(post);
                response.setCategory(post.getCategory().getSlug().name());
                response.setStatusPost(post.getStatus().name());
                return response;
            }
        ).toList();
        return PageResponse.<PostResponse>builder()
                .content(postResponses)
                .pageNo(posts.getNumber())
                .pageSize(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .last(posts.isLast())
                .build();
    }
    @Override
    @Transactional
    @PreAuthorize("hasAuthority('DELETE_POST') and this.isPostOwner(#id) or hasRole('ADMIN')")
    public void deletePost(Long id) {
        Post post = this.postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        this.postRepository.delete(post);
    }

    public boolean isPostOwner(Long id){
        return postRepository.findById(id)
            .map(post->post.getProfile().getId()
            .equals(this.profileServiceImpl.getId()))
            .orElse(false);
    }
}
