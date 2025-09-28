import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseLandingPage from "@/components/ui/Slider";
import Sidebar from "@/components/layout/Sidebar";
export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <div className="flex w-full">
        <div className="order-2 flex-1 px-6 py-8 pt-24">
          <CourseLandingPage></CourseLandingPage>
        </div>
        <div className="order-1 w-32 pt-24">
          {" "}
          {/* Adjust width as needed */}
          <Sidebar></Sidebar>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
