import DynamicCoursePage from "@/app/courses/pro/DynamicCoursePage";
import { notFound } from "next/navigation";
import { getCourseById } from "@/services/coursesPro.service";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  
  const course = await getCourseById(id);

  
  if (!course) {
    notFound();
  }

  return <DynamicCoursePage courseId={id} course={course} />;
}
