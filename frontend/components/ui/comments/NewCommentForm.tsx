"use client";

import { createComment } from "@/helper/actions";
import { toastError } from "@/helper/toast";

export default function NewCommentForm({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userId) {
      const form = event.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const text = formData.get("comment") as string;
      // console.log(text, userId, eventId);
      console.log(text + " " + userId + " " + eventId);
      const data = {
        text: text,
        userId: userId,
        eventId: eventId,
      };
      try {
        await createComment(data);
      } catch (error: any) {
        toastError("Failed to post comment");
      }
      form.reset();
    } else {
      toastError("You need to be logged in to post a comment");
    }
  }

  return (
    <form className="mb-6" onSubmit={handleSubmit}>
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
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
      >
        Post comment
      </button>
    </form>
  );
}
