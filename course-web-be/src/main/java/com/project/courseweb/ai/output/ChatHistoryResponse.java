package com.project.courseweb.ai.output;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatHistoryResponse {
    String role;
    String content;
//    String timestamp;
}