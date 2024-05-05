"use client";

import { updateEventPreview } from "@/helper/actions";
import { toastError, toastSuccess } from "@/helper/toast";
// import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { toast } from "react-toastify";

export default function EditPreviewForm({ id }: { id: string }) {
  // const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("preview", e.target.files[0]);

      const response = await updateEventPreview(id, formData);
      if (response === 200) {
        // console.log("Event Preview Updated!");
        toastSuccess("Event Preview Updated!");
      } else if (response === 400) {
        // console.log("Error updating event preview!");
        toastError("Invalid file type or no file selected!");
      }
    }
  };

  return (
    <div className="py-3 center mx-auto">
      <div className="px-4 py-5 rounded-lg text-center flex justify-center flex-col items-center">
        <div className="cursor-pointer mt-6 relative">
          <Image
            width={500}
            height={500}
            src={`http://localhost:3001/api/event/preview/${id}`}
            alt="preview"
          />
          <label htmlFor="edit_preview"
            className=" absolute w-[100%] h-[100%] top-0 left-0 cursor-pointer"
            ></label>
          <input
            id="edit_preview"
            type="file"
            className="hidden"
            accept="accept"
            onChange={(e) => handleFileChange(e)}
          />
        </div>
      </div>
    </div>
  );
}
