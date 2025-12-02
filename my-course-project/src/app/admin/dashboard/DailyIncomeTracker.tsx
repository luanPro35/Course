"use client";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

interface DailyIncomeTrackerProps {
  todayRevenue: number;
  dailyGoal?: number;
}

export default function DailyIncomeTracker({
  todayRevenue = 0,
  dailyGoal = 10000000,
}: DailyIncomeTrackerProps) {
  const [currentAmount] = useState(todayRevenue);
  const [progress, setProgress] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const finalProgress = Math.min((currentAmount / dailyGoal) * 100, 100);
    const animationDuration = 1000;
    const timer = setTimeout(() => {
      setProgress(finalProgress);
    }, 100);

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsedTime = timestamp - startTimestamp;
      const currentValue = Math.min(
        (elapsedTime / animationDuration) * finalProgress,
        finalProgress
      );
      setAnimatedValue(currentValue);
      if (elapsedTime < animationDuration) {
        requestAnimationFrame(step);
      } else {
        setAnimatedValue(finalProgress);
      }
    };

    const animationFrameId = requestAnimationFrame(step);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentAmount, dailyGoal]);

  const formatShort = (amount: number) => {
    if (amount == null || isNaN(amount)) {
      return "0đ";
    }
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + " triệu";
    }
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + "k";
    }
    return amount.toString();
  };

  const gaugeAngle = (progress / 100) * 180;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 h-full flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Mục tiêu doanh thu ngày
        </h2>
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      <div className="relative w-full max-w-xs mx-auto my-auto">
        <svg viewBox="0 0 200 120" className="w-full">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#134eee", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#a855f7", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(gaugeAngle / 180) * 251.2} 251.2`}
            className="transition-all duration-1000 ease-out"
          />

          <text
            x="100"
            y="72"
            textAnchor="middle"
            className="text-3xl font-bold fill-gray-800"
          >
            {animatedValue.toFixed(1)}%
          </text>
          <text
            x="100"
            y="88"
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            TIẾN ĐỘ
          </text>
        </svg>

        {}
        <div className="flex justify-between items-center px-2 mt-1">
          <div className="text-left">
            <p className="text-xs text-gray-500">Bắt đầu</p>
            <p className="text-sm font-semibold text-gray-700">0đ</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Hiện tại</p>
            <p className="text-base font-bold text-indigo-600">
              {formatShort(currentAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Mục tiêu</p>
            <p className="text-sm font-semibold text-gray-700">
              {formatShort(dailyGoal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
