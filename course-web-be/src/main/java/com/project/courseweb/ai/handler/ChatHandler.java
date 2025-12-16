package com.project.courseweb.ai.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.courseweb.entities.Course;
import com.project.courseweb.repositories.CourseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
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
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChatHandler {
    private final ChatClient ollamaClient;
    private final ChatClient openAiClient;
    private final VectorStore vectorStore;
    private final CourseRepository courseRepository;
    private final ObjectMapper objectMapper;

    private final ChatMemory chatMemory;

    @Value("classpath:/prompts/system-prompt.st") // Prompt cho RAG/Tư vấn
    private Resource ragPromptResource;

    @Value("classpath:/prompts/social-prompt.st") // Prompt cho Tán gẫu
    private Resource socialPromptResource;

    public ChatHandler(@Qualifier("ollamaChatClient") ChatClient ollamaClient,
                       @Qualifier("openAiChatClient") ChatClient openAiClient,
                       VectorStore vectorStore,
                       ChatMemory chatMemory,
                       CourseRepository courseRepository,
                       ObjectMapper objectMapper) {
        this.ollamaClient = ollamaClient;
        this.openAiClient = openAiClient;
        this.vectorStore = vectorStore;
        this.chatMemory = chatMemory;
        this.courseRepository = courseRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public String consultCourse(String userQuery) {
//        Query Rewriting: Viết lại câu hỏi dựa trên lịch sử để tìm kiếm chính xác hơn
//        String rewrittenQuery = rewriteQuery(userQuery);
//        log.info("Original Query: '{}' -> Rewritten Query: '{}'", userQuery, rewrittenQuery);
        String rewrittenQuery = userQuery;

        //dùng 1 model khác để phân loại tin nhắn giữu tài liệu và tán ngẫu
        String intent = classifyIntent(rewrittenQuery); // Phân loại dựa trên câu đã viết lại
        log.info("Ollama running.......");
        log.info("User query: '{}' -> Intent: {}", userQuery, intent);

        if ("CHAT".equals(intent)) {
            // nếu là tán gẫu, trả lời ngay không cần tìm vào vector
            // load prompt tán gẫu
            String socialSystemPrompt = loadPrompt(socialPromptResource, "Bạn là Kobi, trợ lý ảo thân thiện.");

            try {
                log.info("Gemini running............");
                return openAiClient.prompt()
                        .user(userQuery)
                        .advisors(this.chatMemoryAdvisor())
                        .advisors(advisorSpec -> {
                            advisorSpec.param(ChatMemory.CONVERSATION_ID, String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName()));
                        })
                        .system(socialSystemPrompt)
                        .call()
                        .content();
            } catch (Exception exception) {
                log.info("Ollama running.........");
                return ollamaClient.prompt()
                        .advisors(this.chatMemoryAdvisor())
                        .user(userQuery)
                        .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName())))
                        .system(socialSystemPrompt)
                        .call()
                        .content();
            }
        }
        return handleCourseSearch(userQuery, rewrittenQuery);
    }


    //Phân loại ý định câu chat của user
    private String classifyIntent(String query) {
        String prompt = """
                Bạn là một bộ định tuyến thông minh (Intent Router).
                Nhiệm vụ: Phân loại câu người dùng thành 'SEARCH' hoặc 'CHAT'.
                
                1. SEARCH (Tìm kiếm/Tư vấn):
                   - Hỏi về khóa học, giá cả, nội dung, công nghệ (Java, React...).
                   - Hỏi kiến thức lập trình, lộ trình học, tư vấn nghề nghiệp.
                   - Ví dụ: "Khóa Java giá bao nhiêu?", "Học React cần gì?", "Chào bạn, tư vấn giúp mình".
                
                2. CHAT (Xã giao):
                   - Chào hỏi đơn thuần, cảm ơn, khen ngợi.
                   - Không chứa yêu cầu thông tin cụ thể.
                   - Ví dụ: "Xin chào", "Cảm ơn nhé", "Bạn tên gì?".
                
                QUY TẮC ƯU TIÊN: Nếu câu chứa cả chào hỏi VÀ câu hỏi nghiệp vụ (VD: "Hi, giá khóa học?"), PHẢI chọn 'SEARCH'.
                
                Output: Chỉ trả về đúng 1 từ: SEARCH hoặc CHAT.
                Câu: "%s"
                """.formatted(query);
        try {
            return ollamaClient.prompt()
                    .user(prompt)
                    .call()
                    .content()
                    .trim().toUpperCase().contains("SEARCH") ? "SEARCH" : "CHAT";
        } catch (Exception e) {
            log.error("Intent classification failed, fallback to SEARCH", e);
            return "SEARCH";
        }
    }

    private String handleCourseSearch(String userQuery, String searchQuery) {
        // 1. Retrieval: Dùng câu hỏi ĐÃ VIẾT LẠI (searchQuery) để tìm trong Redis cho chính xác
        SearchRequest request = SearchRequest.builder()
                .query(searchQuery)
                .topK(5)
                .similarityThreshold(0.5)
                .build();

        List<Document> similarDocs = vectorStore.similaritySearch(request);

        // 2. Augmentation: Ghép thông tin tìm được vào ngữ cảnh (Context)
        Set<Long> courseIds = similarDocs.stream()
                .map(doc -> {
                    try {
                        Object idObj = doc.getMetadata().get("id");
                        if (idObj != null) {
                            return Long.valueOf(idObj.toString());
                        }
                        return null;
                    } catch (NumberFormatException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<Course> courses = courseRepository.findAllById(courseIds);

        StringBuilder contextBuilder = new StringBuilder();
        List<Map<String, Object>> courseDataForJson = new ArrayList<>();

        for (Course course : courses) {
            contextBuilder.append(String.format("""
                    [ID: %d] Tên: %s
                    Giá: %s
                    Mô tả: %s
                    Kết quả output: %s
                    ----------------
                    """, course.getId(), course.getTitle(), course.getPrice(), course.getDescription(), course.getLearningOutcomes()));

            Map<String, Object> data = new HashMap<>();
            data.put("id", course.getId());
            data.put("title", course.getTitle());
            data.put("price", course.getPrice());
            data.put("thumbnail", course.getThumbnailUrl());
            data.put("slug", course.getId()); 
            courseDataForJson.add(data);
        }

        String context = contextBuilder.toString();
        String availableCoursesJson = "[]";
        try {
            availableCoursesJson = objectMapper.writeValueAsString(courseDataForJson);
        } catch (JsonProcessingException e) {
            log.error("Error serializing course data", e);
        }

        try {
            log.info("Gemini running.............");
            String systemText = loadPrompt(ragPromptResource, "Bạn là chuyên gia tư vấn.");
            
            String outputInstruction = String.format("""
                    
                    [DỮ LIỆU KHÓA HỌC CHI TIẾT (JSON - SYSTEM ONLY)]
                    %s
                    
                    [YÊU CẦU ĐẶC BIỆT]
                    Nếu bạn giới thiệu bất kỳ khóa học nào trong danh sách trên, hãy đưa thêm một khối JSON ở CUỐI CÙNG của câu trả lời theo định dạng sau:
                    [COURSES]
                    [
                      { "id": 1, "title": "...", "price": 1000, "image": "thumbnail_url", "slug": "course_id" }
                    ]
                    [/COURSES]
                    
                    Hãy đảm bảo khối JSON này nằm ở cuối cùng và đúng định dạng. Chỉ lấy thông tin từ [DỮ LIỆU KHÓA HỌC CHI TIẾT].
                    """, availableCoursesJson);

            String finalSystemPrompt = systemText + "\n\n[DANH SÁCH KHÓA HỌC (TÓM TẮT)]\n" + context + outputInstruction;

            // Log prompt để debug
            // log.info("System Prompt: {}", finalSystemPrompt);

            return openAiClient.prompt()
                    .system(finalSystemPrompt)
                    .user(userQuery)
                    .advisors(this.chatMemoryAdvisor())
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName())))
                    .call()
                    .content();
        } catch (Exception exception) {
            log.info("Ollama running..........");
            String systemText = loadPrompt(ragPromptResource, "Bạn là chuyên gia tư vấn.");

            String outputInstruction = String.format("""
                    
                    [DỮ LIỆU KHÓA HỌC CHI TIẾT (JSON - SYSTEM ONLY)]
                    %s
                    
                    [YÊU CẦU ĐẶC BIỆT]
                    Nếu bạn giới thiệu bất kỳ khóa học nào trong danh sách trên, hãy đưa thêm một khối JSON ở CUỐI CÙNG của câu trả lời theo định dạng sau:
                    [COURSES]
                    [
                      { "id": 1, "title": "...", "price": 1000, "image": "thumbnail_url", "slug": "course_id" }
                    ]
                    [/COURSES]
                    
                    Hãy đảm bảo khối JSON này nằm ở cuối cùng và đúng định dạng. Chỉ lấy thông tin từ [DỮ LIỆU KHÓA HỌC CHI TIẾT].
                    """, availableCoursesJson);

            String finalSystemPrompt = systemText + "\n\n[DANH SÁCH KHÓA HỌC (TÓM TẮT)]\n" + context + outputInstruction;

            return ollamaClient.prompt()
                    .system(finalSystemPrompt)
                    .advisors(this.chatMemoryAdvisor())
                    .advisors(advisorSpec -> {
                        advisorSpec.param(ChatMemory.CONVERSATION_ID, String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName()));
                    })
                    .user(userQuery)
                    .call()
                    .content();
        }
    }

    private MessageChatMemoryAdvisor chatMemoryAdvisor() {
        return MessageChatMemoryAdvisor.builder(this.chatMemory).build();
    }

    private String loadPrompt(Resource resource, String fallback) {
        try {
            return resource.getContentAsString(StandardCharsets.UTF_8);
        } catch (Exception e) {
            return fallback;
        }
    }

    //ghi lại câu prompt có ngữ nghĩa bằng cách gom các đoạn chat trước  call LMM 1 lần
    private String rewriteQuery(String originalQuery) {
        try {
            String conversationId = String.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
            List<Message> history = chatMemory.get(conversationId);

            if (history == null || history.isEmpty()) {
                return originalQuery;
            }

            String historyText = history.stream()
                    .map(msg -> String.format("%s: %s", msg.getMessageType().name(), msg.getText()))
                    .collect(Collectors.joining("\n"));

            String prompt = """
                    Nhiệm vụ: Dựa vào LỊCH SỬ HỘI THOẠI, hãy viết lại CÂU HIỆN TẠI của người dùng thành một câu hỏi tìm kiếm độc lập và đầy đủ ngữ cảnh.
                    
                    [LỊCH SỬ HỘI THOẠI]
                    %s
                    
                    [CÂU HIỆN TẠI]: "%s"
                    
                    HƯỚNG DẪN:
                    - Nếu CÂU HIỆN TẠI đã đủ nghĩa, hãy giữ nguyên.
                    - Nếu CÂU HIỆN TẠI là câu hỏi nối tiếp (ví dụ: "Nó giá bao nhiêu?", "Còn gì nữa không?"), hãy kết hợp với tin nhắn gần nhất để tạo câu hỏi hoàn chỉnh (ví dụ: "Khóa học Java giá bao nhiêu?").
                    - Nếu CÂU HIỆN TẠI là lời xác nhận ("Có", "Ok", "Chi tiết đi"), hãy biến nó thành yêu cầu cụ thể dựa trên câu hỏi của trợ lý (ví dụ: "Cho tôi xem chi tiết khóa học Java").
                    
                    OUTPUT: Chỉ trả về DUY NHẤT câu hỏi đã được viết lại.
                    """.formatted(historyText, originalQuery);

            return ollamaClient.prompt(prompt).call().content();
        } catch (Exception e) {
            return originalQuery; // Fallback nếu lỗi thì dùng câu gốc
        }
    }
}
