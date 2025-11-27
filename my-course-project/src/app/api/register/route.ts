

import { NextResponse } from "next/server";
import { USER_API_URL } from "@/services/api.service";


export async function POST(request: Request) {
  try {
    
    const formData = await request.json();
    const { name, email, password, phone } = formData;

    
    
    
    
    const requestBodyToJava = {
      fullName: name,
      email: email,
      passWord: password,
      phone: phone,
    };

    
    
    
    const responseFromBE = await fetch(`${USER_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyToJava), 
    });

    
    const dataFromBE = await responseFromBE.json();

    
    if (!responseFromBE.ok) {
      
      return NextResponse.json(
          { mess: dataFromBE.message, success: false },
          { status: responseFromBE.status }
      );
    }

    
    return NextResponse.json(dataFromBE, { status: responseFromBE.status });

  } catch (error) {
    
    console.error("Register API route error:", error);
    return NextResponse.json(
        { mess: "Lỗi máy chủ nội bộ tại API Route", success: false },
        { status: 500 }
    );
  }
}