package com.project.courseweb.ai.endpoint;

import com.project.courseweb.ai.handler.ChatHandler;
import com.project.courseweb.ai.output.ChatHistoryResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/history")
    public List<ChatHistoryResponse> getHistory() {
        return chatHandler.getHistory();
    }

    @DeleteMapping("/history")
    public void clearHistory() {
        chatHandler.clearHistory();
    }

}
