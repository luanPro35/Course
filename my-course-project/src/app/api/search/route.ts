import { NextResponse } from "next/server";
import { CourseFree } from "@/types/courseFree";
import { CoursePro } from "@/types/coursePro";
import { CardTrending } from "@/types/trending";
import { TopVideo } from "@/types/topVideo";
import { Post } from "@/types/post";
import { getCourses as getProCourses } from "@/services/coursesPro.service";
import { getAllCourses as getFreeCourses } from "@/services/coursesFree.service";
import { getCourses as getTrendingCourses } from "@/services/postTrending.service";
import { getTopVideos } from "@/services/topVideo.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.toLowerCase() || "";

  
  const [proCourses, trendingCourses, freeCourses, topVideos, postRes] = await Promise.all([
    getProCourses(),
    getTrendingCourses(),
    getFreeCourses(),
    getTopVideos(),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`),
  ]);

  const posts: Post[] = await postRes.json();

  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.category.toLowerCase().includes(query.toLowerCase())
    )
    .map((p) => ({
      ...p,
      id: `post-${p.id}`,
      type: "Bài viết",
      url: `/posts/${p.id}`,
    }));

  const filteredProCourses = proCourses
    .filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    )
    .map((c) => ({
      ...c,
      id: `pro-${c.id}`,
      type: "Khóa học miễn phí",
      url: `/coursesPro/${c.id}`,
    }));

  const filteredTrendingCourses = trendingCourses
    .filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    )
    .map((t) => ({
      ...t,
      id: `trending-${t.id}`,
      type: "Xu hướng",
      url: `/Trending/${t.id}`,
    }));

  const filteredFreeCourses = freeCourses
    .filter((course: CourseFree) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    )
    .map((f) => ({
      ...f,
      id: `free-${f.id}`,
      type: "Khóa học Pro",
      url: `/coursesFree/${f.id}`,
    }));

  const filteredTopVideos = topVideos
    .filter((video) => video.title.toLowerCase().includes(query.toLowerCase()))
    .map((v) => ({
      ...v,
      id: `video-${v.id}`,
      type: "Video nổi bật",
      url: `/topVideos/${v.id}`,
    }));

  const results = [
    ...filteredProCourses,
    ...filteredTrendingCourses,
    ...filteredFreeCourses,
    ...filteredTopVideos,
    ...filteredPosts,
  ];
  return NextResponse.json(results);
}
