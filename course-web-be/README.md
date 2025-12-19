# 📘 Course Web Backend API

Chào mừng bạn đến với dự án Backend cho hệ thống E-learning. Đây là một hệ thống mạnh mẽ, được thiết kế theo kiến trúc
Microservices-ready, tích hợp trí tuệ nhân tạo (AI) và các dịch vụ thanh toán, email tự động hiện đại.

---

## 🛠 1. Tech Stack (Công nghệ sử dụng)

Dự án sử dụng các công nghệ mới nhất của hệ sinh thái Java & Spring:

### **Core & Framework**

* **Java:** JDK 21 (LTS).
* **Spring Boot:** 3.5.7.
* **Build Tool:** Maven.

### **Database & Caching**

* **MySQL 8.3:** Cơ sở dữ liệu quan hệ chính (Lưu User, Course, Order...).
* **Redis Stack:**
    * Caching dữ liệu (Tăng tốc độ truy xuất).
    * **Vector Store:** Lưu trữ Vector Embeddings phục vụ cho tính năng RAG (Retrieval-Augmented Generation) của AI.

### **Security & Authentication**

* **Spring Security:** Framework bảo mật chính.
* **JWT (JSON Web Token):** Cơ chế xác thực Stateless.
* **OAuth2 Client:** Tích hợp đăng nhập qua **Google**.

### **Integrations (Tích hợp bên thứ 3)**

* **Spring Cloud OpenFeign and WebCLien:** Client khai báo để gọi API ngoại vi.
    * **VNPay:** Cổng thanh toán nội địa.
    * **Brevo (Sendinblue):** Dịch vụ gửi Email Transactional (OTP, Quên mật khẩu, Thông báo).
* **AWS S3:** Lưu trữ file tĩnh (Video khóa học, Ảnh đại diện).

### **Artificial Intelligence (AI)**

* **Spring AI:** Framework tích hợp LLM.
* **Multi Models:** Hỗ trợ OpenAI (GPT) và Ollama (Local LLM).
* **RAG:** Tìm kiếm thông tin khóa học thông minh dựa trên ngữ nghĩa.

### **Messaging & Async**

* **Apache Kafka & Zookeeper:** Xử lý các tác vụ bất đồng bộ (Gửi mail, Xử lý đơn hàng, Tracking).

---

## 📋 2. Yêu cầu hệ thống (Prerequisites)

Trước khi cài đặt, đảm bảo máy tính của bạn đã có:

1. **Java 21 SDK:** [Tải tại đây](https://www.oracle.com/java/technologies/downloads/).
2. **Docker Desktop:** [Tải tại đây](https://www.docker.com/products/docker-desktop/) (Bắt buộc để chạy MySQL, Redis,
   Kafka).
3. **Git:** Để quản lý mã nguồn.
4. **IDE:** IntelliJ IDEA (Khuyên dùng) hoặc VS Code.

---

## 🚀 3. Hướng dẫn Cài đặt & Cấu hình (Step-by-Step)

### Bước 1: Clone dự án

```bash
git clone https://github.com/luanPro35/Course.git
cd course-web-be
```

### Bước 2: Khởi chạy hạ tầng (Infrastructure)

Chúng ta sử dụng Docker Compose để dựng toàn bộ môi trường phụ trợ.
Tại thư mục gốc của dự án, chạy lệnh:

```bash
docker-compose up -d
```

⏳ *Đợi khoảng 1-2 phút để các container khởi động hoàn tất.*

**Kiểm tra các dịch vụ đang chạy:**

* **MySQL:** Port `3306`
* **Redis:** Port `6379`
* **RedisInsight (GUI):** `http://localhost:8001` (Dùng để xem dữ liệu Redis & Vector).
* **Kafka:** Port `9092`
* **Redis Commander:** `http://localhost:8081`

### Bước 3: Khởi tạo Database

1. Mở công cụ quản lý DB (DBeaver, Navicat, hoặc Database Tool trong IntelliJ).
2. Kết nối đến MySQL:
    * **Host:** `localhost`
    * **Port:** `3306`
    * **Username:** `root`
    * **Password:** `<pass>`
    * **Database:** `course-service` (Nếu chưa có, hãy tạo mới).
3. Mở file `script.sql` trong thư mục gốc dự án.
4. Chạy toàn bộ script để tạo bảng (`auths`, `courses`, `orders`, `spring_ai_chat_memory`...).

### Bước 4: Cấu hình Biến môi trường (Environment Variables)

Để ứng dụng chạy được, bạn cần cấu hình các key trong file `src/main/resources/application.yml` (hoặc tạo file
`application-local.yml`).

**Các thông số quan trọng cần lưu ý:**

```yaml
# 1. Database
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/course-service
    username: root
    password: <pass>

# 2. JWT Configuration
jwt:
  secret: <YOUR_VERY_SECRET_KEY_AT_LEAST_64_CHARS>
  expiration: 86400000 # 1 ngày

# 3. Google OAuth2
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: <YOUR_GOOGLE_CLIENT_ID>
            client-secret: <YOUR_GOOGLE_CLIENT_SECRET>

# 4. VNPay Configuration
vnpay:
  tmn-code: <YOUR_VNPAY_TMN_CODE>
  hash-secret: <YOUR_VNPAY_HASH_SECRET>
  url: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# 5. Brevo (Email)
brevo:
  api-key: <YOUR_BREVO_API_KEY>

# 6. AWS S3
aws:
  access-key: <YOUR_AWS_ACCESS_KEY>
  secret-key: <YOUR_AWS_SECRET_KEY>
  s3:
    bucket: <YOUR_BUCKET_NAME>
    region: <YOUR_REGION>
```

### Bước 5: Chạy ứng dụng

Sau khi cấu hình xong, chạy lệnh sau để khởi động Backend:

**Windows:**

```cmd
mvnw spring-boot:run
```

**Linux/macOS:**

```bash
./mvnw spring-boot:run
```

✅ Khi thấy log `Started CourseApplication in ... seconds`, truy cập API tại: `http://localhost:8080`.

---

## 📖 4. Hướng dẫn Sử dụng & Luồng nghiệp vụ

### 🔐 Authentication (Xác thực)

* **Đăng ký/Đăng nhập:** Người dùng gửi Email/Pass hoặc dùng Google Login.
* **Token:** Server trả về cặp `Access Token` (ngắn hạn) và `Refresh Token` (dài hạn).
* **Sử dụng:** Gửi `Access Token` vào Header `Authorization: Bearer <token>` cho các API bảo mật.

### 💳 Thanh toán (VNPay Flow)

1. Client gọi API `POST /api/v1/orders/create-payment`.
2. Server (dùng OpenFeign) giao tiếp VNPay -> Trả về URL thanh toán.
3. Client mở URL -> Người dùng thanh toán trên VNPay.
4. VNPay redirect về URL cấu hình (Return URL) -> Server verify chữ ký -> Cập nhật trạng thái đơn hàng -> Gửi Kafka
   message.

### 📧 Email (Brevo Flow)

* Khi có sự kiện (Đăng ký mới, Thanh toán thành công), Kafka Consumer sẽ kích hoạt.
* Service sử dụng **OpenFeign** gọi API Brevo để gửi email template đã thiết kế sẵn.

### 🤖 AI Chat & Search

* **Chat:** API `/api/v1/ai/chat` nhận câu hỏi -> Spring AI xử lý qua Ollama/OpenAI -> Trả lời.
* **Vector Search:** Dữ liệu khóa học được embedding và lưu vào Redis Stack. Khi người dùng tìm kiếm, hệ thống tìm các
  khóa học có ngữ nghĩa tương đồng nhất.

---

## 📚 5. Tài liệu API (Swagger/OpenAPI)

Dự án tích hợp sẵn Swagger UI để test API trực quan:

* **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* **API Docs (JSON):** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🛠 6. Troubleshooting (Sửa lỗi thường gặp)

1. **Lỗi kết nối Database/Redis:**
    * Kiểm tra Docker container có đang chạy không (`docker-compose ps`).
    * Kiểm tra port 3306/6379 có bị chiếm dụng bởi service khác không.

2. **Lỗi JWT Signature:**
    * Đảm bảo `JWT_SECRET_KEY` giống nhau giữa các lần restart (nên cấu hình cứng trong file yml hoặc biến môi trường).

3. **Lỗi VNPay Checksum:**
    * Kiểm tra kỹ `HashSecret` và thứ tự tham số khi tạo URL thanh toán.

---

**Happy Coding! 🚀**
