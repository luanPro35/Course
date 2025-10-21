import React from "react";
import { TotalSales } from "./total_views.types";
import RevenueChart from "./RevenueChart";

async function getAnalyticsData(): Promise<TotalSales> {
  return {
    total_Views: 12345,
    time_average: 7.5,
    total_revenue: 1234567,
  };
}

export default async function page() {
  const totalSales: TotalSales = await getAnalyticsData();
  const revenueData = [
    { month: "T1", revenue: 12000 },
    { month: "T2", revenue: 19000 },
    { month: "T3", revenue: 15000 },
    { month: "T4", revenue: 25000 },
    { month: "T5", revenue: 22000 },
    { month: "T6", revenue: 30000 },
    { month: "T7", revenue: 28000 },
    { month: "T8", revenue: 35000 },
    { month: "T9", revenue: 32000 },
    { month: "T10", revenue: 40000 },
    { month: "T11", revenue: 38000 },
    { month: "T12", revenue: 45000 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Total Sales
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalSales.total_revenue)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Total Views
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {totalSales.total_Views.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Time Average
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {totalSales.time_average}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Revenue Overview
        </h2>
        <RevenueChart revenueData={revenueData} />
      </div>
    </div>
  );
}
