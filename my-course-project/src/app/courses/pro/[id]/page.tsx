import DynamicCoursePage from "@/app/courses/pro/DynamicCoursePage";
import { notFound } from "next/navigation";
import { getCourseById } from "@/services/coursesPro.service";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Fetch course trực tiếp từ db.json
  const course = await getCourseById(id);

  // Nếu không tìm thấy course, hiển thị 404
  if (!course) {
    notFound();
  }

  return <DynamicCoursePage courseId={id} course={course} />;
}
