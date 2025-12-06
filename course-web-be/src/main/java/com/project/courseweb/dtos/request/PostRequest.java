package com.project.courseweb.dtos.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PostRequest {
    String author;
    String title;
    String category;
    String thumbnailUrl;
    String content;
    String fullContent;
    String statusPost;
}
