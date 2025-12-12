package com.project.courseweb.ai.output;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizResponse {
    String question;
    String a;
    String b;
    String c;
    String d;
    String correctAnswer;
    String explanation;
}
