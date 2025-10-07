import React, { useState } from "react";
import ErrorAnimation from "@/components/ui/ErrorAnimation";
import { BlogFormData } from "@/types/blog.types";
import { validateForm } from "@/utils/blog.utils";
export default function useBlogValidation() {
  const [error, setError] = useState<string[]>([]);
  const [show, setShow] = useState(true);

  const validate = (FormData: BlogFormData): boolean => {
    const validationError = validateForm(FormData);
    setError(validationError);

    if (validationError.length > 0) {
      setShow(true);
      setTimeout(() => setShow(false), 2000);
      return false;
    }
    return true;
  };

  const ErrorFeedBack = () => {
    if (show) {
      return (
        <div>
          {show && error.length > 0 && (
            <ErrorAnimation mess={error.join(", ")} />
          )}
        </div>
      );
    }
    return null;
  };
  return { validate, ErrorFeedBack, error };
}
