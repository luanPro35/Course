import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseLandingPage from "@/components/ui/Slider";
export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <CourseLandingPage></CourseLandingPage>
      <Footer></Footer>
    </div>
  );
}
