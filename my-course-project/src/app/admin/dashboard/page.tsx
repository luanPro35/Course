import React from "react";
import OrderChart from "./OrderChart";
import Information from "./Information";
export default function page() {
  const orderStats = [
    { month: "Tháng 1", totalOrders: 120 },
    { month: "Tháng 2", totalOrders: 90 },
    { month: "Tháng 3", totalOrders: 150 },
    { month: "Tháng 4", totalOrders: 210 },
    { month: "Tháng 5", totalOrders: 180 },
    { month: "Tháng 6", totalOrders: 240 },
    { month: "Tháng 7", totalOrders: 120 },
    { month: "Tháng 8", totalOrders: 90 },
    { month: "Tháng 9", totalOrders: 150 },
    { month: "Tháng 10", totalOrders: 210 },
    { month: "Tháng 11", totalOrders: 180 },
    { month: "Tháng 12", totalOrders: 240 },
  ];

  const totalUsers = 100;
  const totalCourses = 50;
  const totalOrders = 200;

  return (
    <div>
      <Information
        totalOrders={totalOrders}
        totalUsers={totalUsers}
        totalCourses={totalCourses}
      />
      <OrderChart data={orderStats} />
    </div>
  );
}
