"use client";
import React, {useEffect, useRef, useState} from "react";
import Lottie from "lottie-react";
import animationChat from "../../../../public/animations/chatbot.json";
import ChatCourseCard from "@/components/ui/ChatCourseCard";

interface Course {
    id: number;
    title: string;
    price: number;
    image: string;
    slug?: string;
}

interface Message {
    id?: number | string; // ID có thể là số hoặc chuỗi
    role: "USER" | "ASSISTANT";
    content: string;
    timestamp?: Date;
    courses?: Course[];
}

const TypingIndicator = () => (
    <div className="flex justify-start animate-slide-in-right">
        <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white text-gray-800 shadow-md border border-gray-100">
            <div className="flex items-center space-x-1">
                <span className="text-sm">Bot đang nhập</span>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);

// Cấu hình đường dẫn Backend (Lưu ý: Đảm bảo Backend đã bật CORS cho cổng 3000)
const API_BASE_URL = "http://localhost:8080/project";

/**
 * Helper function để trích xuất thông tin khóa học từ text của bot
 */
const parseBotResponse = (text: string): { cleanText: string; courses: Course[] } => {
    const courseBlockRegex = /\[COURSES\]([\s\S]*?)\[\/COURSES\]/;
    const match = text.match(courseBlockRegex);
    if (match && match[1]) {
        try {
            const courses = JSON.parse(match[1]);
            const cleanText = text.replace(courseBlockRegex, "").trim();
            return { cleanText, courses };
        } catch (e) {
            console.error("Error parsing courses JSON", e);
        }
    }
    return { cleanText: text, courses: [] };
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(true); // Mở sẵn để test
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isOpen]);

    // Hàm lấy lịch sử chat từ backend
    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            // Lấy trang đầu tiên, 20 tin nhắn
            const response = await fetch(`${API_BASE_URL}/ai/history`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const data = await response.json();

            // API thường trả về tin nhắn MỚI NHẤT ở đầu (index 0).
            // Ta cần đảo ngược lại (.reverse()) để hiển thị theo thứ tự thời gian: CŨ -> MỚI (từ trên xuống dưới)
            // Thêm ID và timestamp cho tin nhắn lịch sử
            const historyMessages = data.map((msg: any, index: number) => ({
                ...msg,
                id: `hist-${Date.now()}-${index}`,
                timestamp: new Date(), // Giả lập timestamp
            }));
            setMessages(historyMessages);
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Chỉ gọi fetchHistory một lần duy nhất khi component được mount
        fetchHistory();
    }, []);

    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        const userMessage: Message = {
            id: `user-${Date.now()}`, // Tạo ID cho tin nhắn người dùng
            content: inputValue,
            role: "USER",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue("");
        setIsLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("Bạn cần đăng nhập để sử dụng tính năng này.");
            }

            const params = new URLSearchParams();
            params.append("content", currentInput);
            const response = await fetch(`${API_BASE_URL}/ai?${params.toString()}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Rất tiếc, đã có lỗi xảy ra từ máy chủ."
                );
            }

            const botResponseText = await response.text();

            const { cleanText, courses } = parseBotResponse(botResponseText);

            const botMessage: Message = {
                id: `bot-${Date.now()}`, // Tạo ID cho tin nhắn bot
                content: cleanText,
                role: "ASSISTANT",
                timestamp: new Date(),
                courses: courses.length > 0 ? courses : undefined,
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: `error-${Date.now()}`, // Tạo ID cho tin nhắn lỗi
                content:
                    error instanceof Error
                        ? error.message
                        : "Không thể kết nối đến trợ lý ảo.",
                role: "ASSISTANT",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading) {
            handleSendMessage();
        }
    };

    return (
        <div className="relative z-50">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-24 h-24 cursor-pointer transform hover:scale-110 transition-all duration-300 z-50"
            >
                <Lottie animationData={animationChat} loop={true}/>
                <div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    1
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed bottom-24 right-5 md:absolute md:bottom-20 md:right-0 w-[90vw] md:w-96 h-[600px] md:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-gray-100 z-50">
                    <div
                        className="relative bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-4 flex-shrink-0">
                        <div
                            className="absolute inset-0 bg-black opacity-0 hover:opacity-5 transition-opacity duration-300"/>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Trợ lý ảo Kobi</h3>
                                    <p className="text-xs text-sky-100">Luôn sẵn sàng hỗ trợ</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div
                        ref={chatContainerRef}
                        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
                    >
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className="flex flex-col space-y-2">
                                    <div
                                        className={`flex ${
                                            message.role === "USER" ? "justify-end" : "justify-start"
                                        } animate-slide-in-right`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                                message.role === "USER"
                                                    ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md"
                                                    : "bg-white text-gray-800 shadow-md border border-gray-100"
                                            }`}
                                        >
                                            <div
                                                className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                                                dangerouslySetInnerHTML={{
                                                    __html: message.content
                                                        ? message.content.replace(/\n/g, "<br />")
                                                        : "",
                                                }}
                                            ></div>
                                            <p
                                                className={`text-xs mt-1 ${message.role === "USER" ? "text-sky-100" : "text-gray-400"
                                                }`}
                                            >
                                                {message.timestamp
                                                    ? message.timestamp.toLocaleTimeString("vi-VN", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : new Date().toLocaleTimeString("vi-VN", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                            </p>
                                        </div>
                                    </div>

                                    {message.courses && message.courses.length > 0 && (
                                        <div className="flex flex-col gap-3 pb-2 pt-1 px-1">
                                            {message.courses.map((course) => (
                                                <ChatCourseCard
                                                    key={course.id}
                                                    id={course.id}
                                                    title={course.title}
                                                    price={course.price}
                                                    image={course.image}
                                                    slug={course.slug}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && <TypingIndicator/>}
                            <div ref={messagesEndRef}/>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                disabled={isLoading}
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 text-sm disabled:bg-gray-100"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={inputValue.trim() === "" || isLoading}
                                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
