export interface Course {
  id: string;
  image: string;
  title: string;
  price: number;
  discountPrice?: number;
  author: string;
  numberOfPosts: number;
  totalTime: string;
}
