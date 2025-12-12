package com.project.courseweb.ai.config;

import com.project.courseweb.ai.advisors.TokenPrintAdvisor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SafeGuardAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.util.List;

@Configuration
public class MultiAiClientConfig {

    @Value("classpath:/prompts/system-prompt.st")
    private Resource systemPrompt;

    @Bean
    ChatMemory chatMemory(JdbcChatMemoryRepository chatMemoryRepository) {
        return MessageWindowChatMemory.builder()
                .chatMemoryRepository(chatMemoryRepository)
                .maxMessages(20)
                .build();
    }

    @Bean("openAiChatClient")
    public ChatClient openChatClient(OpenAiChatModel openAiChatModel, ChatMemory chatMemory, VectorStore vectorStore) {
        MessageChatMemoryAdvisor chatMemoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();
//        QuestionAnswerAdvisor questionAnswerAdvisor = new QuestionAnswerAdvisor(vectorStore);
        return ChatClient.builder(openAiChatModel)
                .defaultAdvisors(new TokenPrintAdvisor(),
                        new SafeGuardAdvisor(listBadWords()),
                        chatMemoryAdvisor
//                        questionAnswerAdvisor
                )
                .defaultSystem(systemPrompt)
                .defaultOptions(OpenAiChatOptions.builder()
                        .temperature(0.7)
                        .model("gemini-2.5-flash")
                        .build()
                )
                .build();
    }

    @Bean("ollamaChatClient")
    public ChatClient ollamaChatClient(OllamaChatModel ollamaChatModel) {
//        MessageChatMemoryAdvisor chatMemoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();
//        QuestionAnswerAdvisor questionAnswerAdvisor = new QuestionAnswerAdvisor(vectorStore);
        return ChatClient.builder(ollamaChatModel)
                .defaultAdvisors(
//                        chatMemoryAdvisor,
//                        questionAnswerAdvisor,
                        new SafeGuardAdvisor(listBadWords()),
                        new TokenPrintAdvisor()
                )//RAG
//                .defaultSystem(systemPrompt)
                .defaultOptions(OllamaOptions.builder()
                        .model("qwen2.5:latest")
                        .temperature(0.3)
                        .numCtx(1024)
                        .build()
                )
                .build();
    }

    private List<String> listBadWords() {
        return List.of("fuck", "bitch", "asshole", "dick", "penis", "vagina", "cunt", "motherfucker", "shit");
    }
}
