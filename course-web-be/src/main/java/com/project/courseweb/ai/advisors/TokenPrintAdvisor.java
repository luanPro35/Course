package com.project.courseweb.ai.advisors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClientRequest;
import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.chat.client.advisor.api.CallAdvisor;
import org.springframework.ai.chat.client.advisor.api.CallAdvisorChain;
import org.springframework.ai.chat.client.advisor.api.StreamAdvisor;
import org.springframework.ai.chat.client.advisor.api.StreamAdvisorChain;
import org.springframework.ai.chat.metadata.Usage;
import reactor.core.publisher.Flux;

@Slf4j
public class TokenPrintAdvisor implements CallAdvisor, StreamAdvisor {

    @Override
    public ChatClientResponse adviseCall(ChatClientRequest chatClientRequest, CallAdvisorChain callAdvisorChain) {
        log.info("My Token print Advisor called....");
        log.info("Request:{}", chatClientRequest.prompt().getContents());
        ChatClientResponse chatClientResponse = callAdvisorChain.nextCall(chatClientRequest);
        log.info("Token receive from model");
        log.info("Response:{}", chatClientResponse.chatResponse().getResult().getOutput().getText());
        log.info("Prompt token: " + chatClientResponse.chatResponse().getMetadata().getUsage().getPromptTokens());
        log.info("Completion token: " + chatClientResponse.chatResponse().getMetadata().getUsage().getCompletionTokens());
        log.info("Total token: " + chatClientResponse.chatResponse().getMetadata().getUsage().getTotalTokens());
        return chatClientResponse;
    }

    @Override
    public Flux<ChatClientResponse> adviseStream(ChatClientRequest chatClientRequest, StreamAdvisorChain streamAdvisorChain) {
        return streamAdvisorChain.nextStream(chatClientRequest)
                .doOnNext(chatClientResponse -> {
                    // Trong Stream, Usage thường chỉ xuất hiện ở chunk cuối cùng
                    Usage usage = chatClientResponse.chatResponse().getMetadata().getUsage();
                    if (usage != null && (usage.getTotalTokens() > 0 || usage.getPromptTokens() > 0)) {
                        log.info("Stream Token Usage - Prompt: {}, Completion: {}, Total: {}",
                                usage.getPromptTokens(),
                                usage.getCompletionTokens(),
                                usage.getTotalTokens());
                    }
                });
    }

    @Override
    public String getName() {
        return this.getClass().getName();
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
