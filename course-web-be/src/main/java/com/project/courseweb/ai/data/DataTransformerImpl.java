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

    // Khởi tạo Splitter một lần duy nhất (Singleton)
    // Giảm minChunkSizeChars xuống 100 để đảm bảo các đoạn mô tả ngắn vẫn được giữ nguyên vẹn
    TokenTextSplitter tokenTextSplitter = new TokenTextSplitter(300, 100, 10, 5000, true);

    @Override
    public List<Document> transformer(List<Document> documents) {
        return tokenTextSplitter.apply(documents);
    }
}
