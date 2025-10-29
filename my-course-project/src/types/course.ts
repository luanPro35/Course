export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  video: string;
  votes: number;
  students: number;
  free: boolean;
  price?: number;
  discountPrice?: number;
  updatedAt: string;
}
