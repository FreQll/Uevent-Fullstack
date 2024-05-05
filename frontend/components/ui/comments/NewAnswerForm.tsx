"use client";

import { createComment, createReply } from "@/helper/actions";
import { toastError } from "@/helper/toast";
import { Button } from "@/components/ui/button";
import { comment } from "postcss";
import { useMyUser } from "@/store/users";

export default function NewAnswerForm({
  commentId,
  userName,
  setShowReply,
}: {
  commentId: string;
  userName: string;
  setShowReply: (value: boolean) => void;
}) {
  const [ myUser,  axiosGetWithToken] = useMyUser((state) => [state.myUser, state.axiosGetWithToken]);
  const userId = myUser?.id;

  const handleDiscard = () => {
    setShowReply(false);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userId) {
      const form = event.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const text = formData.get("comment") as string;
      console.log(text + " " + userId + " " + commentId);

      const data = {
        text: text,
        userId: userId,
        commentId: commentId,
      };
      try {
        await createReply(data);
      } catch (error: any) {
        toastError("Failed to post comment");
      }
      form.reset();
      setShowReply(false);
    } else {
      toastError("You need to be logged in to post a comment");
    }
  }

  return (
    <form className="mt-6 mb-3" onSubmit={handleSubmit}>
      <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <label htmlFor="comment" className="sr-only">
          Your comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={6}
          className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
          placeholder="Write a comment..."
          defaultValue={`@${userName}, `}
          required
        ></textarea>
      </div>
      <div className="flex flex-row gap-4">
        <Button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
        >
          Post comment
        </Button>
        <Button type="button" onClick={handleDiscard} variant="outline">
          Discard
        </Button>
      </div>
    </form>
  );
}
