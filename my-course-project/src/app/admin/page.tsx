import OrderChart from "@/app/admin/dashboard/OrderChart";
import Information from "@/app/admin/dashboard/Information";
import DailyIncomeTracker from "@/app/admin/dashboard/DailyIncomeTracker";
import RecentOrders from "@/app/admin/dashboard/RecentOrders";
import { CoursePro } from "@/types/coursePro";
export const orderData = [
  { month: "Tháng 1", totalOrders: 240 },
  { month: "Tháng 2", totalOrders: 120 },
  { month: "Tháng 3", totalOrders: 180 },
  { month: "Tháng 4", totalOrders: 90 },
  { month: "Tháng 5", totalOrders: 210 },
  { month: "Tháng 6", totalOrders: 150 },
  { month: "Tháng 7", totalOrders: 260 },
  { month: "Tháng 8", totalOrders: 130 },
  { month: "Tháng 9", totalOrders: 195 },
  { month: "Tháng 10", totalOrders: 170 },
  { month: "Tháng 11", totalOrders: 280 },
  { month: "Tháng 12", totalOrders: 200 },
];

const Dashboard = () => {
  const totalUsers = 100;
  const totalCourses = 50;
  const totalOrders = 200;

  const orders: CoursePro[] = [
    {
      id: "1",
      image: "/images/Cpp.png",
      title: "Khóa học ReactJS cơ bản",
      price: 500000,
      author: "Luan Nguyen",
      numberOfPosts: 10,
      totalTime: "2h 30m",
    },
    {
      id: "2",
      image: "/images/Figma.png",
      title: "Khóa học NodeJS nâng cao",
      price: 750000,
      discountPrice: 600000,
      author: "Luan Nguyen",
      numberOfPosts: 15,
      totalTime: "3h 45m",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Information
            totalOrders={totalOrders}
            totalUsers={totalUsers}
            totalCourses={totalCourses}
          />
          <div className="pt-3">
            <RecentOrders orders={orders} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <DailyIncomeTracker />
        </div>
      </div>
      <div className="mt-16">
        <OrderChart data={orderData} />
      </div>
    </div>
  );
};

export default Dashboard;
