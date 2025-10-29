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
        // In a real application, you would fetch from an API endpoint
        // For this example, we're directly importing db.json
        const response = await fetch("/db.json"); // Assuming db.json is accessible publicly or via a local API
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

        // Process courses directly associated with users (if they have price info)
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

        // Process courses from "my-courses" array
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
            // Check if the course is already added to avoid duplicates if it's in both user.courses and my-courses
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
      <div className="container mx-auto px-4 py-8">
        Loading user purchase data...
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Purchase Overview</h1>
      {userPurchases.length === 0 ? (
        <p>No user purchase data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  User Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Purchased Courses
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody>
              {userPurchases.map((purchase) => (
                <tr
                  key={purchase.userId}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {purchase.fullName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <ul className="list-disc list-inside">
                      {purchase.purchasedCourses.map((course, idx) => (
                        <li key={idx}>
                          {course.title} -{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(course.price)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 font-bold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(purchase.totalSpent)}
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
