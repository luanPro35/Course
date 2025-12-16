package com.project.courseweb.ai.data;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataTransformerImpl implements DataTransformer {

    // Chunk lớn hơn + overlap nhiều hơn để giữ ngữ cảnh cho tiếng Việt & RAG
    // (giảm số lượng chunk, tăng chất lượng embedding)
    TokenTextSplitter tokenTextSplitter = new TokenTextSplitter(
            500,  // defaultChunkSize
            200,  // minChunkSizeChars
            60,   // minChunkOverlap
            5000, // maxCharsPerDocument
            true  // keepSeparator
    );


    @Override
    public List<Document> transformer(List<Document> documents) {
        return tokenTextSplitter.apply(documents);
    }
}
