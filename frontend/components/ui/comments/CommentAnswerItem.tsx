"use client";

import { CommentType } from "@/helper/types";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import NewAnswerForm from "./NewAnswerForm";
import { useMyUser } from "@/store/users";

export default function CommentAnswerItem({
  comment,
  commentParentId,
}: {
  comment: CommentType;
  commentParentId: string;
}) {
  const [showReply, setShowReply] = useState(false);
  // const session = useSession();
  const { myUser } = useMyUser();
  const isAuth = myUser.loggedIn;

  const handleReply = () => {
    setShowReply(!showReply);
  };

  return (
    <article className="p-6 mb-3 ml-6 text-base bg-transparent border-l-2 border-b-2 border-gray-200">
      <footer className="flex justify-between items-center mb-2 ">
        <div className="flex items-center gap-2">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            <Image
              className="mr-2 w-6 h-6 rounded-full"
              width={24}
              height={24}
              src={`http://localhost:3001/api/user/avatar/${comment.userId}`}
              alt={comment.user.full_name}
            />
            {comment.user.full_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {moment(comment.createdAt).format("LLL")}
          </p>
        </div>
        <button
          id="dropdownComment2Button"
          data-dropdown-toggle="dropdownComment2"
          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-40 bg-transparent rounded-lg focus:ring-4 focus:outline-none"
          type="button"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
          <span className="sr-only">Comment settings</span>
        </button>
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{comment.text}</p>
      {isAuth && (
        <div className="flex items-center mt-4 space-x-4">
          <button
            type="button"
            onClick={handleReply}
            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
          >
            <svg
              className="mr-1.5 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
              />
            </svg>
            Reply
          </button>
        </div>
      )}

      {showReply && (
        <NewAnswerForm
          commentId={commentParentId}
          setShowReply={setShowReply}
          userName={comment.user.full_name}
        />
      )}
    </article>
  );
}
