import { CardTrending } from "@/types/trending";
import { BlogService } from "./blog.service";

export const getCourses = async (): Promise<CardTrending[]> => {
  try {
    const blogPosts = await BlogService.getAll();
    
    const trendingPosts: CardTrending[] = blogPosts.map((post) => {
      let timePost = "Vừa xong";
      if (post.createdAt) {
        const createdDate = new Date(post.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) {
          timePost = `${diffMins} phút trước`;
        } else if (diffHours < 24) {
          timePost = `${diffHours} giờ trước`;
        } else if (diffDays < 30) {
          timePost = `${diffDays} ngày trước`;
        } else {
          timePost = createdDate.toLocaleDateString("vi-VN");
        }
      }
      
      return {
        id: post.id,
        image: post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
        title: post.title,
        author: post.user?.fullName || post.author || "Tác giả",
        time_posts: timePost,
      };
    });
    
    return trendingPosts.slice(0, 8);
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    return [];
  }
};
