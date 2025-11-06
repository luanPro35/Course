package com.project.courseweb.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.PostResponse;
import com.project.courseweb.entities.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "category", ignore = true)
    Post toPostEntity(PostRequest request);
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "statusPost", ignore = true)
    PostResponse toPostResponse(Post post);
}
