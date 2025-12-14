package com.project.courseweb.ai.endpoint;

import com.project.courseweb.ai.handler.ChatHandler;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ai")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AIEndpoint {
    ChatHandler chatHandler;

    @PostMapping
    public String advisorCourse(@RequestParam("content") String content) {
        return chatHandler.consultCourse(content);
    }
}
