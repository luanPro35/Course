# Hướng dẫn Phong cách Lập trình (Coding Style Guide) & Kiến trúc Dự án Course Web BE

Tài liệu này đúc kết toàn bộ cấu trúc dự án, phong cách lập trình, quy ước thiết kế và các mẫu code chuẩn từ dự án `course-web-be`. Mục tiêu là cung cấp thông tin chi tiết giúp các AI Agent sau này có thể đọc và viết code đồng bộ 100% với định dạng, tiêu chuẩn và công nghệ hiện tại của hệ thống.

---

## 1. Tổng Quan Công Nghệ (Tech Stack)

Dự án được xây dựng dựa trên các công nghệ cốt lõi sau:
- **Ngôn ngữ**: Java 21
- **Framework**: Spring Boot 3.5.7, Spring Cloud 2025.0.0
- **Cơ sở dữ liệu**: MySQL 8.3 & Redis (sử dụng `redis/redis-stack` để vừa làm Cache vừa làm Vector Database).
- **Security**: Spring Security (OAuth2 Resource Server + JWT xác thực phi trạng thái).
- **Trí tuệ nhân tạo (AI)**: Spring AI 1.0.3 (Sử dụng mô hình Gemini qua cổng OpenAI compatibility, Ollama làm Embedding và định tuyến ý định, Redis Vector Store cho RAG, JDBC lưu lịch sử hội thoại).
- **Truyền thông tin / Asynchronous**: Apache Kafka (quản lý gửi email bất đồng bộ qua Brevo).
- **Thư viện tiện ích**: Lombok, MapStruct 1.5.5.Final, OpenFeign, WebClient.

---

## 2. Cấu Trúc Thư Mục & Phân Lớp (Package Structure)

Dự án tuân theo kiến trúc phân lớp truyền thống (Layered Architecture), được tổ chức gọn gàng dưới package gốc `com.project.courseweb`:

- `ai/`: Chứa cấu trúc tích hợp Spring AI.
  - `advisors/`: Các bộ tư vấn chat (Ví dụ: `TokenPrintAdvisor.java`, `SafeGuardAdvisor`).
  - `config/`: Cấu hình AI Model client, Vector Store, startup runner.
  - `data/`: Tải dữ liệu khóa học vào Vector DB và chunk tài liệu (`DataLoader`, `DataTransformer`).
  - `endpoint/`: REST API tương tác với Chatbot (`AIEndpoint.java`).
  - `handler/`: Logic xử lý hội thoại chính, định tuyến ý định (`ChatHandler.java`).
  - `output/`: DTO trả về kết quả chatbot.
- `configurations/`: Cấu hình hệ thống (Spring Security, Redis, AWS S3, VnPay, WebClient).
- `controllers/`: Lớp REST Controllers điều phối Request/Response.
- `dtos/`: Các đối tượng truyền tải dữ liệu (Data Transfer Objects).
  - `request/`: Chứa các Request DTO.
  - `response/`: Chứa các Response DTO.
  - `https/`: DTO dùng để giao tiếp với các API bên thứ 3 (Brevo, Google OAuth...).
- `entities/`: Lớp thực thể lưu trữ CSDL (JPA Entities). Có thư mục con `authentication/` cho Auth, Role, Permission.
- `enums/`: Chứa các enums định nghĩa trạng thái, mã lỗi (`ErrorCode`), mã thành công (`SuccessCode`), quyền hạn.
- `exceptions/`: Cơ chế xử lý ngoại lệ toàn cục (`AppException`, `GlobalExceptionHandler`).
- `httpsClients/`: Các FeignClient hoặc HTTP Interface để gọi dịch vụ ngoài.
- `kafka/`: Người tiêu thụ sự kiện (`KafkaConsumer.java`) để xử lý bất đồng bộ.
- `mappers/`: Các Interface MapStruct thực hiện chuyển đổi qua lại giữa Entity và DTO.
- `repositories/`: Các Interface Spring Data JPA thao tác với CSDL.
- `services/`: Chứa Interface định nghĩa nghiệp vụ hệ thống.
  - `implement/`: Chứa các lớp triển khai thực tế (Implementation), kết thúc bằng hậu tố `ServiceImpl`.
- `utils/`: Chứa các hàm tiện ích và Scheduled Tasks (`RefreshTokenClearAuto.java`).

---

## 3. Phong Cách Lập Trình & Quy Ước Thiết Kế (Coding Styles)

### 3.1. Sử Dụng Lombok Cực Hạn & Constructor Injection
Dự án áp dụng phong cách tối giản code mẫu (boilerplate code) bằng cách tận dụng tối đa các annotation của Lombok:
- **`@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)`**: Bắt buộc dùng ở mức Class (trong các ServiceImpl, Controller) để tự động khai báo các thuộc tính là `private final`.
- **`@RequiredArgsConstructor`**: Tự động tạo Constructor cho các trường `final`. Đây là cách duy nhất để thực hiện **Constructor Injection** (không dùng `@Autowired`).
- **`@NonFinal` kết hợp `@Value`**: Với những thuộc tính cấu hình inject từ file `.yaml`/`.properties`, do class sử dụng `@FieldDefaults(makeFinal = true)` nên cần chú thích thêm `@NonFinal` để tránh lỗi biên dịch:
  ```java
  @NonFinal
  @Value("${google.client-id}")
  String clientId;
  ```

### 3.2. Quy Tắc Lớp Thực Thể (JPA Entities)
- Đặt tên bảng dạng số nhiều (`@Table(name = "courses")`).
- Dùng `@FieldDefaults(level = AccessLevel.PRIVATE)` (không dùng `makeFinal = true` đối với Entity).
- Luôn chỉ định rõ kiểu quan hệ tải chậm (`FetchType.LAZY`) cho `@ManyToOne` và `@OneToMany` để tối ưu hóa truy vấn CSDL, tránh lỗi N+1.
- Tự động quản lý thời gian tạo/cập nhật bằng `@PrePersist` và `@PreUpdate`:
  ```java
  @PrePersist
  protected void onCreate() {
      createdAt = LocalDateTime.now();
      updatedAt = LocalDateTime.now();
  }
  @PreUpdate
  protected void onUpdate() {
      updatedAt = LocalDateTime.now();
  }
  ```

### 3.3. DTO & Ánh Xạ Đối Tượng (MapStruct)
- Dữ liệu đi vào và đi ra khỏi Controller **phải thông qua DTO** (`dtos/request/*` và `dtos/response/*`), tuyệt đối không trả thẳng Entity cho Client.
- Chuyển đổi Entity sang DTO và ngược lại sử dụng MapStruct với khai báo `@Mapper(componentModel = "spring")`.
- Định nghĩa các ánh xạ thuộc tính lồng nhau hoặc khác tên bằng `@Mapping(target = "x", source = "y.x")`. Các thuộc tính không ánh xạ cần `ignore = true`.
- Hỗ trợ các phương thức ánh xạ mặc định (`default`) để xử lý các chuyển đổi phức tạp (ví dụ: chuyển Set các Object Role thành Set String).

---

## 4. Chuẩn Hóa API Response & Xử Lý Lỗi Toàn Cục

### 4.1. Cấu Trúc Trả Về Chuẩn (`ApiResponse<T>`)
Tất cả các API REST trong Controller phải trả về lớp bọc chuẩn `ApiResponse<T>`, được định dạng JSON thống nhất:
```json
{
  "status": 200,
  "message": "Authenticated successfully",
  "data": { ... }
}
```
*Lưu ý*: Lớp bọc sử dụng `@JsonInclude(JsonInclude.Include.NON_NULL)` để loại bỏ các trường null khi trả về Client.

### 4.2. Quản Lý Trạng Thái Qua Enum `SuccessCode` và `ErrorCode`
- **`SuccessCode`**: Định nghĩa trạng thái HTTP, thông điệp phản hồi thành công của từng nghiệp vụ cụ thể.
- **`ErrorCode`**: Định nghĩa trạng thái HTTP, mã lỗi nội bộ và thông điệp lỗi tương ứng.
- **`AppException`**: Lớp ngoại lệ Runtime chung của hệ thống nhận vào một `ErrorCode`.
- **`GlobalExceptionHandler`**: Sử dụng `@ControllerAdvice` để bắt toàn bộ `AppException` và các ngoại lệ xác thực dữ liệu đầu vào (`MethodArgumentNotValidException`), sau đó đóng gói lại thành định dạng `ApiResponse.error()` tương ứng.

---

## 5. Security & Authentication (Xác Thực & Phân Quyền)

- Hệ thống sử dụng token **JWT tự tạo**, xác thực không lưu trạng thái (Stateless).
- **Blacklist Token trên Redis**: Khi người dùng `logout`, Access Token sẽ được đưa vào blacklist trên Redis với thời gian hết hạn bằng đúng thời gian sống còn lại của Token.
- **Custom JWT Decoder**: Triển khai `JwtDecoder` kiểm tra thủ công xem Access Token có nằm trong Blacklist của Redis hay không trước khi giải mã bằng `NimbusJwtDecoder`.
- **Phân quyền mức Method**: Sử dụng `@EnableMethodSecurity` và dùng `@PreAuthorize("hasRole('ADMIN')")` hoặc `@PreAuthorize("hasRole('USER')")` trực tiếp tại các Service/Controller.

---

## 6. Gọi API Bên Thứ 3 & Xử Lý Bất Đồng Bộ

### 6.1. Hỗ Trợ Cả OpenFeign và Spring 6 HTTP Interface (WebClient)
Dự án sử dụng cả 2 cơ chế tùy thuộc vào nhu cầu:
1. **OpenFeign**: Dành cho giao tiếp đồng bộ đơn giản (ví dụ: `GoogleOauth2Client`).
2. **Spring 6 HTTP Interface**: Khai báo Interface với các annotation `@PostExchange`/`@GetExchange` (ví dụ: `BrevoEmailClient`, `VnPayClient`). Các client này được khởi tạo thông qua `HttpServiceProxyFactory` cấu hình với `WebClient`.

**Quy tắc tích hợp Reactive & Synchronous**:
Vì các REST Controller chạy trên luồng đồng bộ Spring MVC (blocking), khi gọi các API trả về kiểu Reactive (`Mono`/`Flux`) từ `WebClient`, **bắt buộc sử dụng phương thức `.block()`** để chuyển đổi sang kiểu dữ liệu đồng bộ:
```java
var response = vnPayClient.callRefund(vnp_Params).block();
```

### 6.2. Xử Lý Bất Đồng Bộ Qua Kafka
- Để giảm độ trễ khi xử lý các nghiệp vụ tốn thời gian (như gửi email), hệ thống đẩy sự kiện vào Kafka.
- Lớp `NotificationService` đóng vai trò Producer đẩy thông điệp định dạng JSON vào topic `email-notifications` qua `KafkaTemplate`.
- Lớp `KafkaConsumer` sử dụng `@KafkaListener(topics = "email-notifications")` lắng nghe sự kiện, tự động phân tích cú pháp và gọi `EmailService` để gửi mail qua Brevo Client.

---

## 7. Kiến Trúc AI & RAG (Spring AI)

Hệ thống tích hợp AI cực kỳ tinh tế và tối ưu cho tiếng Việt với các thành phần:
- **Phân loại Ý định (Chat Router)**: Lớp `ChatHandler` sử dụng mô hình nội bộ Ollama (`mistral:latest` hoặc tương đương) để phân tích câu hỏi của người dùng và trả về ý định `"SEARCH"` (yêu cầu tìm kiếm khóa học) hoặc `"CHAT"` (hỏi đáp/chào hỏi thông thường).
- **Quản Lý Lịch Sử Chat (Chat Memory)**: Lịch sử được lưu trữ lâu dài trong database MySQL thông qua `JdbcChatMemoryRepository`. Sử dụng `MessageWindowChatMemory` để giới hạn tối đa 200 tin nhắn gần nhất làm ngữ cảnh.
- **Viết lại câu hỏi (Query Rewriting)**: Trước khi tìm kiếm Vector, hệ thống dùng lịch sử 10 câu thoại gần nhất viết lại câu hỏi hiện tại để đảm bảo câu hỏi chứa đầy đủ ngữ cảnh độc lập.
- **Redis Vector Store**:
  - Dữ liệu khóa học được nhúng (Embedding) bằng Ollama (`embeddinggemma:latest`).
  - Được lưu vào chỉ mục `rag-index` trên Redis với các trường metadata được định nghĩa sẵn (`price`, `id`).
  - Sử dụng bộ lọc khoảng cách tương tự (`similarityThreshold(0.35)`) và lấy tối đa `topK(10)`.
- **Chunking tài liệu nâng cao**: Sử dụng `TokenTextSplitter` cấu hình riêng để tối ưu hóa tiếng Việt (`chunkSize = 500`, `minChunkSizeChars = 200`, `overlap = 60`).
- **Deterministic ID**: Để tránh trùng lặp dữ liệu khi nạp lại Vector, các chunk của khóa học được gắn ID cố định dạng `{courseId}_part_{index}`. Khi cần reload, hệ thống sẽ thực hiện xóa toàn bộ tài liệu cũ rồi nạp lại.
- **Custom Advisors**:
  - `TokenPrintAdvisor`: Đo và in ra số lượng token tiêu thụ.
  - `SafeGuardAdvisor`: Lọc các từ tục tĩu (bad words) khỏi câu thoại.

---

## 8. Cấu Hình Caching & Tránh Avalanche trên Redis

- Redis được bật Caching bằng `@EnableCaching`. Các cache name có tiền tố động để phân biệt môi trường: `"kobi:" + activeProfile + ":"`.
- **Tránh Cache Avalanche (Nghẽn/Sập Cache đồng loạt)**: Để tránh việc nhiều dữ liệu cache hết hạn cùng một thời điểm gây quá tải database, thời gian TTL (Time-To-Live) của cache được cấu hình ngẫu nhiên (Randomized TTL):
  ```java
  .withCacheConfiguration("posts", cacheConfiguration()
      .entryTtl(Duration.ofMinutes(RandomGenerator.getDefault().nextInt(1, 29))))
  .withCacheConfiguration("courses", cacheConfiguration()
      .entryTtl(Duration.ofMinutes(RandomGenerator.getDefault().nextInt(1, 59))))
  ```

---

## 9. Mẫu Code Tiêu Chuẩn (Template Examples)

Khi phát triển thêm tính năng mới, hãy copy chính xác cấu trúc của các mẫu code dưới đây:

### 9.1. Mẫu Entity Chuẩn
```java
package com.project.courseweb.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Entity
@Table(name = "examples")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Example {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    @Column(name = "status")
    String status;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 9.2. Mẫu Controller Chuẩn
```java
package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.request.ExampleRequest;
import com.project.courseweb.dtos.response.ExampleResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.ExampleService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/examples")
public class ExampleController {
    ExampleService exampleService;

    @PostMapping
    public ApiResponse<ExampleResponse> createExample(@Valid @RequestBody ExampleRequest request) {
        return ApiResponse.ok(exampleService.create(request), SuccessCode.CREATED_SUCCESS);
    }
}
```

### 9.3. Mẫu Service Interface & Implementation Chuẩn
```java
// Service Interface
package com.project.courseweb.services;

import com.project.courseweb.dtos.request.ExampleRequest;
import com.project.courseweb.dtos.response.ExampleResponse;
import org.springframework.stereotype.Service;

@Service
public interface ExampleService {
    ExampleResponse create(ExampleRequest request);
}

// Service Implementation
package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.request.ExampleRequest;
import com.project.courseweb.dtos.response.ExampleResponse;
import com.project.courseweb.entities.Example;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.ExampleMapper;
import com.project.courseweb.repositories.ExampleRepository;
import com.project.courseweb.services.ExampleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExampleServiceImpl implements ExampleService {
    ExampleRepository exampleRepository;
    ExampleMapper exampleMapper;

    @Override
    @Transactional
    public ExampleResponse create(ExampleRequest request) {
        log.info("Creating new example: {}", request.getName());
        if (exampleRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.DUPLICATE_NAME);
        }
        Example example = exampleMapper.toEntity(request);
        Example saved = exampleRepository.save(example);
        return exampleMapper.toResponse(saved);
    }
}
```

### 9.4. Mẫu MapStruct Mapper Chuẩn
```java
package com.project.courseweb.mappers;

import com.project.courseweb.dtos.request.ExampleRequest;
import com.project.courseweb.dtos.response.ExampleResponse;
import com.project.courseweb.entities.Example;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExampleMapper {
    ExampleResponse toResponse(Example entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Example toEntity(ExampleRequest request);
}
```
