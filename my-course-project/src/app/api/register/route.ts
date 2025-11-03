// D:/MyProjects/Course/my-course-project/src/app/api/register/route.ts

import { NextResponse } from "next/server";
import { USER_API_URL } from "@/services/api.service";

// Hàm này sẽ được thực thi trên server mỗi khi có một request POST tới '/api/register'
export async function POST(request: Request) {
  try {
    // 1. Nhận và phân tích dữ liệu từ Frontend
    const formData = await request.json();
    const { name, email, password, phone } = formData;

    // 2. Ánh xạ (Map) dữ liệu sang định dạng mà Backend Java yêu cầu
    // Đây là một bước rất quan trọng. Frontend có thể dùng tên trường là 'name' và 'password',
    // nhưng Backend Java lại yêu cầu 'fullName' và 'passWord'.
    // API Route này sẽ làm nhiệm vụ "dịch" dữ liệu.
    const requestBodyToJava = {
      fullName: name,
      email: email,
      passWord: password,
      phone: phone,
    };

    // 3. Gửi yêu cầu tới Backend Java từ môi trường server an toàn
    // URL của BE (http://localhost:8080) và các API Key (nếu có) sẽ được giữ bí mật ở đây.
    // Người dùng cuối không bao giờ thấy được thông tin này.
    const responseFromBE = await fetch(`${USER_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyToJava), // Gửi đi body đã được ánh xạ
    });

    // 4. Nhận và xử lý phản hồi từ Backend Java
    const dataFromBE = await responseFromBE.json();

    // 5. Xử lý trường hợp Backend Java trả về lỗi (ví dụ: email đã tồn tại)
    if (!responseFromBE.ok) {
      // Chuyển tiếp thông báo lỗi và status code từ BE về lại cho FE
      return NextResponse.json(
          { mess: dataFromBE.message, success: false },
          { status: responseFromBE.status }
      );
    }

    // 6. Nếu thành công, trả về dữ liệu từ BE cho FE
    return NextResponse.json(dataFromBE, { status: responseFromBE.status });

  } catch (error) {
    // Bắt các lỗi không mong muốn (ví dụ: mất kết nối mạng giữa Next.js và BE Java)
    console.error("Register API route error:", error);
    return NextResponse.json(
        { mess: "Lỗi máy chủ nội bộ tại API Route", success: false },
        { status: 500 }
    );
  }
}