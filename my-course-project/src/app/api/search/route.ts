import { NextResponse } from "next/server";
import { CourseFree } from "@/types/courseFree";
import { CoursePro } from "@/types/coursePro";
import { CardTrending } from "@/types/trending";
import { TopVideo } from "@/types/topVideo";
import { Post } from "@/types/post";
import {
  FREE_API_URL,
  PRO_API_URL,
  TRENDING_API_URL,
  TOP_VIDEO_API_URL,
} from "@/services/api.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.toLowerCase() || "";

  const [proRes, trendingRes, freeRes, videoRes, postRes] = await Promise.all([
    fetch(PRO_API_URL),
    fetch(TRENDING_API_URL),
    fetch(FREE_API_URL),
    fetch(TOP_VIDEO_API_URL),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`),
  ]);

  const proCourses: CoursePro[] = await proRes.json();
  const trendingCourses: CardTrending[] = await trendingRes.json();
  const freeCourses: CourseFree[] = await freeRes.json();
  const topVideos: TopVideo[] = await videoRes.json();
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
