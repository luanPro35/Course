package com.project.courseweb.ai.data;

import com.project.courseweb.entities.Course;
import com.project.courseweb.enums.CourseStatus;
import com.project.courseweb.repositories.CourseRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public void loadData() {
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

                // Tạo Document mới với ID cố định, giữ nguyên content và metadata
                Document newDoc = new Document(fixedId, chunk.getFormattedContent(), chunk.getMetadata());
                finalDocumentsToAdd.add(newDoc);
            }
        }

        vectorStore.add(finalDocumentsToAdd);
        log.info("Data setup complete. Added {} documents.", finalDocumentsToAdd.size());
    }

    private Document converterDocument(Course course) {
        String outcomes = course.getLearningOutcomes() != null
                ? course.getLearningOutcomes().replace("[", "").replace("]", "").replace("\"", "")
                : "";

        String content = String.format("Tên khóa học: %s. Mô tả: %s. Kết quả đạt được: %s",
                course.getTitle(),
                course.getDescription(),
                outcomes);

        Map<String, Object> metadata = Map.of("id", course.getId(),
                "price", course.getPrice()
        );

        return new Document(content, metadata);
    }
}
