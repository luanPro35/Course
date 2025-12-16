package com.project.courseweb.ai.data;

import com.project.courseweb.entities.Course;
import com.project.courseweb.enums.CourseStatus;
import com.project.courseweb.repositories.CourseRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataLoaderImpl implements DataLoader {
    CourseRepository courseRepository;
    DataTransformer dataTransformer;
    VectorStore vectorStore;

    @Override
    public void loadDataVector() {
        List<Course> list = this.courseRepository.getCoursesStatusByStatus(CourseStatus.PUBLISHED);

        if (list.isEmpty()) {
            log.warn("No course published");
        }

//        List<Document> documents = list.stream().map(
//                this::converterDocument
//        ).collect(Collectors.toList());
        List<Document> finalDocumentsToAdd = new ArrayList<>();
        // Xử lý từng khóa học để kiểm soát việc sinh ID cho các chunk
        for (Course course : list) {
            Document baseDoc = converterDocument(course);
            // 1. Cắt nhỏ document gốc
            List<Document> chunks = dataTransformer.transformer(List.of(baseDoc));

            //2. Gán ID cố định (Deterministic ID) cho từng mảnh
            for (int i = 0; i < chunks.size(); i++) {
                Document chunk = chunks.get(i);
                // Tạo ID dạng: "courseId_part_index" (VD: 10_part_0, 10_part_1)
                String fixedId = course.getId() + "_part_" + i;

                Map<String, Object> enrichedMeta = new HashMap<>(chunk.getMetadata());
                enrichedMeta.put("courseId", course.getId());
                enrichedMeta.put("title", course.getTitle());
                enrichedMeta.put("price", course.getPrice());
                enrichedMeta.put("chunkIndex", i);
                enrichedMeta.put("chunkCount", chunks.size());
                enrichedMeta.put("type", "course");


                // Tạo Document mới với ID cố định, giữ nguyên content và metadata
                Document newDoc = new Document(fixedId, chunk.getFormattedContent(), chunk.getMetadata());
                finalDocumentsToAdd.add(newDoc);
            }
        }

        vectorStore.add(finalDocumentsToAdd);
        log.info("Data setup complete. Added {} documents.", finalDocumentsToAdd.size());
    }

    @Override
    public void reloadDataVector() {
        Filter.Expression filter = new Filter.Expression(
                Filter.ExpressionType.GTE, new Filter.Key("price"), new Filter.Value(-1)
        );

        SearchRequest request = SearchRequest.builder()
                .filterExpression(filter)
                .topK(10000)
                .similarityThreshold(0.0)
                .build();

        List<Document> existingDocs = vectorStore.similaritySearch(request);
        if (!existingDocs.isEmpty()) {
            List<String> ids = existingDocs.stream().map(Document::getId).toList();
            vectorStore.delete(ids);
            log.info("Đã xóa {} documents cũ.", ids.size());
        }

        this.loadDataVector();
    }


    private Document converterDocument(Course course) {
        String outcomes = course.getLearningOutcomes() != null
                ? course.getLearningOutcomes().replace("[", "").replace("]", "").replace("\"", "")
                : "";

        // Format “card” ổn định để embedding bắt đúng ý và retrieval chính xác hơn
        String content = String.format("""
                        COURSE_TITLE: %s
                        COURSE_PRICE: %s
                        COURSE_DESC: %s
                        COURSE_OUTCOMES: %s
                        """,
                safe(course.getTitle()),
                course.getPrice() == null ? "" : course.getPrice(),
                safe(course.getDescription()),
                safe(outcomes)
        );

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("courseId", course.getId());
        metadata.put("title", course.getTitle());
        metadata.put("price", course.getPrice());
        metadata.put("type", "course");

        return new Document(content, metadata);
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }

}
