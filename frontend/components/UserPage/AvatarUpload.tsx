import axios from "@/helper/axios";
import { toastError, toastSuccess } from "@/helper/toast";
import { useMyUser } from "@/store/users";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChangeEvent } from "react";

export const AvatarUpload = () => {
  // const navigate = useNavigate();
  // const user = getSavedState().user;
  const { myUser } = useMyUser();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("avatar", e.target.files[0]);

      try {
        await axios.patch(`/user/avatar/${myUser.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toastSuccess("Avatar updated");
        // navigate("/");
        // redirect("/user/my-page");
      } catch (error: any) {
        toastError(error.message);
      }
    }
  };

  return (
    <div className="py-3 center w-[40%]">
      <div className="px-4 py-5 rounded-lg text-center flex justify-center flex-col items-center">
        <div className="mb-4">
          <Image
            src={`http://localhost:3001/api/user/avatar/${myUser.id}`}
            className="rounded-full object-cover"
            alt="avatar"
            width={160}
            height={160}
          />
        </div>
        <label className="cursor-pointer mt-6">
          <span className="mt-2 text-sm leading-normal px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white rounded-md font-bold">
            Select Avatar
          </span>
          <input
            type="file"
            className="hidden"
            // multiple="multiple"
            accept="accept"
            onChange={(e) => handleFileChange(e)}
          />
        </label>
      </div>
    </div>
  );
};
