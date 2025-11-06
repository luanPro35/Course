package com.project.courseweb.dtos.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@Builder
public class PostResponse {
    String id;
    String author;
    String title;
    String category;
    String thumbnailUrl;
    String content;
    String fullContent;
    String statusPost;
}
