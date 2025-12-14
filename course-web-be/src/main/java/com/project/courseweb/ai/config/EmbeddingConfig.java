package com.project.courseweb.ai.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class EmbeddingConfig {
    @Bean
    @Primary
    public EmbeddingModel embeddingModelOllama(@Qualifier("ollamaEmbeddingModel") EmbeddingModel embeddingModel) {
        return embeddingModel;
    }

//    @Bean
//    @Primary
//    public EmbeddingModel embeddingModelOpenAI(@Qualifier("openAiEmbeddingModel") EmbeddingModel embeddingModel) {
//        return embeddingModel;
//    }
}
