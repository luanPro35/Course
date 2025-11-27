import { CourseFree } from "@/types/courseFree";
import React from "react";
import { getCourseById } from "@/services/coursesFree.service";
import RouteLayout from "@/components/layout/RouteLayout";
import Loading from "@/components/ui/Loading"; 
import CourseDetailDynamicWrapper from "../CourseDetailDynamicWrapper";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const course: CourseFree = await getCourseById(id);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-500">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <RouteLayout>
      <CourseDetailDynamicWrapper course={course} />
    </RouteLayout>
  );
}
