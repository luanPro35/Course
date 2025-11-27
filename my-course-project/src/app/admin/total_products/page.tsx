"use client";

import React, { useEffect, useState } from "react";
import { DbJson, User } from "@/types/user";
import { Course } from "@/types/course";

interface UserPurchase {
  userId: string;
  fullName: string;
  purchasedCourses: { title: string; price: number }[];
  totalSpent: number;
}

export default function UserPurchasesPage() {
  const [userPurchases, setUserPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserPurchases() {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) {
          throw new Error("Failed to fetch db.json");
        }
        const db: DbJson = await response.json();

        const usersMap = new Map<string, User>();
        db.users.forEach((user) => {
          usersMap.set(user.id, user);
        });

        const proCoursesMap = new Map<string, Course>();
        db.coursesPro.forEach((course) => {
          proCoursesMap.set(course.id.toString(), course);
        });

        const userPurchasesData: { [key: string]: UserPurchase } = {};

        db.users.forEach((user) => {
          if (user.courses) {
            user.courses.forEach((course) => {
              const proCourse = proCoursesMap.get(course.id.toString());
              if (proCourse && proCourse.price) {
                if (!userPurchasesData[user.id]) {
                  userPurchasesData[user.id] = {
                    userId: user.id,
                    fullName: user.fullName,
                    purchasedCourses: [],
                    totalSpent: 0,
                  };
                }
                userPurchasesData[user.id].purchasedCourses.push({
                  title: proCourse.title,
                  price: proCourse.price,
                });
                userPurchasesData[user.id].totalSpent += proCourse.price;
              }
            });
          }
        });

        db["my-courses"].forEach((myCourse) => {
          const user = usersMap.get(myCourse.userId);
          const proCourse = proCoursesMap.get(myCourse.course.id.toString());

          if (user && proCourse && proCourse.price) {
            if (!userPurchasesData[user.id]) {
              userPurchasesData[user.id] = {
                userId: user.id,
                fullName: user.fullName,
                purchasedCourses: [],
                totalSpent: 0,
              };
            }
            const isDuplicate = userPurchasesData[
              user.id
            ].purchasedCourses.some((c) => c.title === proCourse.title);
            if (!isDuplicate) {
              userPurchasesData[user.id].purchasedCourses.push({
                title: proCourse.title,
                price: proCourse.price,
              });
              userPurchasesData[user.id].totalSpent += proCourse.price;
            }
          }
        });

        setUserPurchases(Object.values(userPurchasesData));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchUserPurchases();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  
  const totalRevenue = userPurchases.reduce(
    (sum, purchase) => sum + purchase.totalSpent,
    0
  );
  const totalCustomers = userPurchases.length;
  const totalCoursesSold = userPurchases.reduce(
    (sum, purchase) => sum + purchase.purchasedCourses.length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Thống Kê Mua Hàng
      </h1>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Tổng Doanh Thu</p>
          <p className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Tổng Khách Hàng</p>
          <p className="text-2xl font-bold text-green-600">{totalCustomers}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Khóa Học Đã Bán</p>
          <p className="text-2xl font-bold text-purple-600">
            {totalCoursesSold}
          </p>
        </div>
      </div>

      {}
      {userPurchases.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Chưa có dữ liệu mua hàng</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Khách Hàng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Khóa Học Đã Mua
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Số Lượng
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Tổng Chi Tiêu
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userPurchases.map((purchase) => (
                <tr
                  key={purchase.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {purchase.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 space-y-1">
                      {purchase.purchasedCourses.map((course, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span>{course.title}</span>
                          <span className="text-gray-500 ml-4">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(course.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {purchase.purchasedCourses.length} khóa học
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-lg font-bold text-blue-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(purchase.totalSpent)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
