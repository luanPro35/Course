import { NextResponse } from "next/server";
import { CourseFree } from "@/types/courseFree";
import { BlogService } from "@/services/blog.service";
import { getCourses as getProCourses } from "@/services/coursesPro.service";
import { getAllCourses as getFreeCourses } from "@/services/coursesFree.service";
import { getCourses as getTrendingCourses } from "@/services/postTrending.service";
import { getTopVideos } from "@/services/topVideo.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") || "").toLowerCase().trim();

  try {
    const [proCourses, trendingCourses, freeCourses, topVideos, posts] = await Promise.all([
      getProCourses(),
      getTrendingCourses(),
      getFreeCourses(),
      getTopVideos(),
      BlogService.getAll(),
    ]);

    const filteredPosts = (posts || [])
      .filter((post) => {
        if (!post) return false;
        const titleMatch = post.title?.toLowerCase().includes(query);
        const categoryMatch = post.category?.toLowerCase().includes(query);
        return titleMatch || categoryMatch;
      })
      .map((p) => ({
        ...p,
        id: `post-${p.id}`,
        type: "Bài viết",
        url: `/posts/${p.id}`,
      }));

    const filteredProCourses = (proCourses || [])
      .filter((course) => 
        course?.title?.toLowerCase().includes(query)
      )
      .map((c) => ({
        ...c,
        id: `pro-${c.id}`,
        type: "Khóa học Pro",
        url: `/coursesPro/${c.id}`,
      }));

    const filteredTrendingCourses = (trendingCourses || [])
      .filter((course) => 
        course?.title?.toLowerCase().includes(query)
      )
      .map((t) => ({
        ...t,
        id: `trending-${t.id}`,
        type: "Xu hướng",
        url: `/Trending/${t.id}`,
      }));

    const filteredFreeCourses = (freeCourses || [])
      .filter((course: CourseFree) => 
        course?.title?.toLowerCase().includes(query)
      )
      .map((f) => ({
        ...f,
        id: `free-${f.id}`,
        type: "Khóa học miễn phí",
        url: `/coursesFree/${f.id}`,
      }));

    const filteredTopVideos = (topVideos || [])
      .filter((video) => 
        video?.title?.toLowerCase().includes(query)
      )
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

    const uniqueResults = results.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

    return NextResponse.json(uniqueResults);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Lỗi khi tìm kiếm dữ liệu" }, { status: 500 });
  }
}
