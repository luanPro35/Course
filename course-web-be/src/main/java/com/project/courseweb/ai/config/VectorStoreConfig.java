package com.project.courseweb.ai.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.TokenCountBatchingStrategy;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.redis.RedisVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPooled;

@Configuration
public class VectorStoreConfig {
    @Bean
    public JedisPooled jedisPooled() {
        return new JedisPooled("localhost", 6379);
    }

    @Bean
    public VectorStore vectorStore(JedisPooled jedisPooled, EmbeddingModel embeddingModel) {
        return RedisVectorStore.builder(jedisPooled, embeddingModel)
                .indexName("rag-index")
                .metadataFields(
                        RedisVectorStore.MetadataField.numeric("price"),
                        RedisVectorStore.MetadataField.numeric("id")
                )
                .initializeSchema(true)
                .batchingStrategy(new TokenCountBatchingStrategy())
                .build();
    }
}
