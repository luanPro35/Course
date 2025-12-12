package com.project.courseweb.ai.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChatHandler {
    private final ChatClient ollamaClient;
    private final ChatClient openAiClient;
    private final VectorStore vectorStore;

    private final ChatMemory chatMemory;
    @Value("classpath:/prompts/system-prompt.st")
    private Resource resource;

    public ChatHandler(@Qualifier("ollamaChatClient") ChatClient ollamaClient,
                       @Qualifier("openAiChatClient") ChatClient openAiClient,
                       VectorStore vectorStore,
                       ChatMemory chatMemory) {
        this.ollamaClient = ollamaClient;
        this.openAiClient = openAiClient;
        this.vectorStore = vectorStore;
        this.chatMemory = chatMemory;
    }

    @Transactional
    public String consultCourse(String userQuery) {
        //dùng 1 model khác để phân loại tin nhắn giữu tài liệu và tán ngẫu
        String intent = classifyIntent(userQuery);
        log.info("User query: '{}' -> Intent: {}", userQuery, intent);

        if ("CHAT".equals(intent)) {
            MessageChatMemoryAdvisor chatMemoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();

            // Nếu là tán gẫu, trả lời ngay không cần tìm vào vecto
            try {
                log.info("GEMINI");
                return openAiClient.prompt()
                        .user(userQuery)
                        .advisors(advisorSpec -> {
                            advisorSpec.param(ChatMemory.CONVERSATION_ID, String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName()));
                        })
                        .system("Bạn là Kobi, trợ lý ảo thân thiện. Hãy trò chuyện vui vẻ với người dùng.")
                        .call()
                        .content();
            } catch (Exception exception) {
                log.info("OLLAMA");
                return ollamaClient.prompt()
                        .user(userQuery)
                        .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName())))
                        .system("Bạn là Kobi, trợ lý ảo thân thiện. Hãy trò chuyện vui vẻ với người dùng.")
                        .call()
                        .content();
            }
        }

        // Nếu là SEARCH, tiếp tục quy trình RAG bên dưới
        return handleCourseSearch(userQuery);
    }


    //Phân loại ý định câu chat của user
    private String classifyIntent(String query) {
        String prompt = """
                Phân loại câu sau thành 'SEARCH' (nếu hỏi về kiến thức, khóa học, giá cả, lập trình) hoặc 'CHAT' (nếu là chào hỏi, cảm ơn, nói chuyện phiếm).
                Chỉ trả về đúng 1 từ: SEARCH hoặc CHAT.
                Câu: "%s"
                """.formatted(query);
        //dùng ollama
        return ollamaClient.prompt(prompt).call().content().trim().toUpperCase().contains("SEARCH") ? "SEARCH" : "CHAT";
    }

    private String handleCourseSearch(String userQuery) {
        // 1. Retrieval: Tìm kiếm 3 khóa học liên quan nhất trong Redis
        SearchRequest request = SearchRequest.builder()
                .query(userQuery)
                .topK(4) // Lấy 4 kết quả
                .similarityThreshold(0.4) // Tăng ngưỡng lên để tránh lấy rác (0.2 là quá thấp)
                .build();

        List<Document> similarDocs = vectorStore.similaritySearch(request);

        if (similarDocs.isEmpty()) {
            return "Xin lỗi, hiện tại hệ thống chưa tìm thấy khóa học nào phù hợp với yêu cầu của bạn.";
        }

        // 2. Augmentation: Ghép thông tin tìm được vào ngữ cảnh (Context)
        String context = similarDocs.stream()
                .map(doc -> String.format("- %s (Giá: %s)", doc.getFormattedContent(), doc.getMetadata().get("price")))
                .collect(Collectors.joining("\n\n"));

        log.info("Tìm thấy context: \n{}", context);

        // 3. Generation: Tạo Prompt và gửi cho AI

        MessageChatMemoryAdvisor chatMemoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();


        try {
            log.info("GEMINI");
            String systemText = resource.getContentAsString(StandardCharsets.UTF_8);

            String finalSystemPrompt = systemText + "\n\nDANH SÁCH KHÓA HỌC HIỆN CÓ:\n" + context;
            return openAiClient.prompt()
                    .system(finalSystemPrompt)
                    .user(userQuery)
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName())))
                    .call()
                    .content();
        } catch (Exception exception) {
            log.info("OLLAMA");
            String systemText = "Bạn là Kobi, trợ lý ảo tư vấn khóa học.";
            try {
                systemText = resource.getContentAsString(StandardCharsets.UTF_8);
            } catch (Exception e) {
            }
            String finalSystemPrompt = systemText + "\n\nDANH SÁCH KHÓA HỌC:\n" + context;

            return ollamaClient.prompt()
                    .system(finalSystemPrompt)
                    .advisors(chatMemoryAdvisor)
                    .advisors(advisorSpec -> {
                        advisorSpec.param(ChatMemory.CONVERSATION_ID, String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName()));
                    })
                    .user(userQuery)
                    .call()
                    .content();
        }
    }
}
