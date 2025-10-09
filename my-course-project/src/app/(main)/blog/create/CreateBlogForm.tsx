// ... existing code ...
import { useBlogForm } from "@/hooks/useBlogForm";
import { Loader2 } from "lucide-react"; // Import loader icon

export default function CreateBlogForm() {
  const {
    errors,
    isUploading, // Get the new state
    handleImageChange, // Get the new handler
  } = useBlogForm({
    id: 0,
    author: "",
    title: "",
    content: "",
    category: "",
    image: "",
  });

  return (
    <>
      <label
        htmlFor="image"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Ảnh đại diện
      </label>
      <div className="flex items-center gap-4">
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange} // Use the new handler
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
        />
        {isUploading && <Loader2 className="animate-spin text-orange-500" />}
      </div>
      {errors.image && (
        <p className="mt-2 text-sm text-red-600">{errors.image}</p>
      )}
    </>
  );
}
