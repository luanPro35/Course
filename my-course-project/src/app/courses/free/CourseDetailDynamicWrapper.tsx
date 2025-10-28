"use client";

import dynamic from "next/dynamic";
import Loading from "@/components/ui/Loading";
import type { CourseDetailClientProps } from "./CourseDetailClient";

const CourseDetailClient = dynamic<CourseDetailClientProps>(
  () => import("./CourseDetailClient").then((mod) => mod.CourseDetailClient),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

interface CourseDetailDynamicWrapperProps {
  course: CourseDetailClientProps["course"];
}

export default function CourseDetailDynamicWrapper({
  course,
}: CourseDetailDynamicWrapperProps) {
  return <CourseDetailClient course={course} />;
}
