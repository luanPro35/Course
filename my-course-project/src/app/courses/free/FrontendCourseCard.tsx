import { CourseFree } from "@/types/courseFree";
import Image from "next/image";
import Link from "next/link";
import { Users, BookOpen, Clock } from "lucide-react";

interface FrontendCourseCardProps {
  course: CourseFree;
}

export default function FrontendCourseCard({ course }: FrontendCourseCardProps) {
  return (
    <Link href={`/courses/free/${course.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-300 cursor-pointer group">
        <div className="relative h-40 overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            width={400}
            height={160}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {course.free}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-600 gap-2">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-gray-500" />
              <span>{course.people.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1">
              <BookOpen size={14} className="text-gray-500" />
              <span>{course.numberOfPosts}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-500" />
              <span>{course.totalTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}