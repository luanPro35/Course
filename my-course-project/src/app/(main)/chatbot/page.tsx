"use client";
import React, { useState, useRef, useEffect } from "react";
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
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
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

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Xin chào! Tôi là Kobi, trợ lý ảo của Course Web. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]); 

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
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
      const response = await fetch(`/api/ai?${params.toString()}`, {
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
      
      let cleanText = botResponseText;
      let courses: Course[] = [];
      const courseBlockRegex = /\[COURSES\]([\s\S]*?)\[\/COURSES\]/;
      const match = botResponseText.match(courseBlockRegex);

      if (match && match[1]) {
        try {
          courses = JSON.parse(match[1]);
          cleanText = botResponseText.replace(courseBlockRegex, "").trim();
        } catch (e) {
          console.error("Error parsing courses JSON", e);
        }
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: cleanText,
        sender: "bot",
        timestamp: new Date(),
        courses: courses.length > 0 ? courses : undefined,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text:
          error instanceof Error
            ? error.message
            : "Không thể kết nối đến trợ lý ảo.",
        sender: "bot",
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
        <Lottie animationData={animationChat} loop={true} />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
          1
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-5 md:absolute md:bottom-20 md:right-0 w-[90vw] md:w-96 h-[600px] md:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-gray-100 z-50">
          <div className="relative bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-4 flex-shrink-0">
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-5 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
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

          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col space-y-2">
                  <div
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    } animate-slide-in-right`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md"
                          : "bg-white text-gray-800 shadow-md border border-gray-100"
                      }`}
                    >
                      <div
                        className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: message.text
                            ? message.text.replace(/\n/g, "<br />")
                            : "",
                        }}
                      ></div>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-sky-100"
                            : "text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString("vi-VN", {
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
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
