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
    @Override
    public List<Document> transformer(List<Document> documents) {
        var splitter = new TokenTextSplitter(300, 400, 10, 5000, true);
        return splitter.apply(documents);
    }
}
