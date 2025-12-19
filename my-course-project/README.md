# 📘 Course Web Frontend

Đây là dự án Frontend cho hệ thống quản lý và kinh doanh khóa học trực tuyến, được xây dựng bằng Next.js và NextUI.

---

## 🛠 1. Tech Stack (Công nghệ sử dụng)

*   **Framework:** [Next.js](https://nextjs.org/) 15 (với Turbopack).
*   **UI Library:** [NextUI](https://nextui.org/).
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/).
*   **Ngôn ngữ:** TypeScript.
*   **HTTP Client:** Axios.
*   **Biểu đồ:** Chart.js, Recharts.
*   **Linting:** ESLint.
*   **Mock API:** `json-server` (để phát triển độc lập với Backend).

---

## 📋 2. Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy của bạn đã cài đặt:

*   [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên).
*   [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/).
*   [Git](https://git-scm.com/).

---

## 🚀 3. Hướng dẫn Cài đặt và Chạy

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd my-course-project
```

### Bước 2: Cài đặt Dependencies
Sử dụng `npm` để cài đặt các gói cần thiết từ `package.json`:

```bash
npm install
```

### Bước 3: Cấu hình Biến môi trường
Tạo một file `.env.local` ở thư mục gốc và cấu hình các biến sau. File này chứa các thông tin nhạy cảm và không nên được commit lên Git.

```env
# URL của Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080

# (Tùy chọn) Các key khác nếu cần
NEXT_PUBLIC_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
```
**Lưu ý:** `NEXT_PUBLIC_API_URL` cần trỏ đến địa chỉ Backend của bạn (mặc định là `http://localhost:8080` nếu chạy local).

### Bước 4: Chạy ứng dụng
Khởi động server development với Turbopack (nhanh hơn):

```bash
npm run dev
```

Sau khi chạy thành công, mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000).

---

## 📖 4. Hướng dẫn Sử dụng

### Tài khoản Admin
Bạn có thể sử dụng tài khoản sau để đăng nhập vào trang quản trị:

*   **Email:** `luanlq@example.com`
*   **Password:** `0905622341`

### Các lệnh NPM hữu ích
*   `npm run dev`: Chạy ứng dụng ở chế độ development.
*   `npm run build`: Build ứng dụng cho môi trường production.
*   `npm run start`: Chạy ứng dụng đã được build.
*   `npm run lint`: Kiểm tra lỗi code với ESLint.
*   `npm run json-server`: Khởi động một mock API server từ file `db.json` tại port `3001`. Lệnh này hữu ích khi bạn muốn phát triển Frontend mà không cần chạy Backend thật.

---

## 📁 5. Cấu trúc thư mục

*   `src/app`: Chứa các trang và layout chính của ứng dụng (App Router).
*   `src/components`: Chứa các component tái sử dụng.
*   `src/lib`: Chứa các hàm tiện ích, cấu hình...
*   `public`: Chứa các file tĩnh (hình ảnh, fonts...).
*   `package.json`: Định nghĩa các script và dependencies.
*   `.env.local`: Chứa các biến môi trường cục bộ.

---

**Happy Coding! 🚀**
