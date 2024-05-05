"use client";

import { CommentType } from "@/helper/types";
import CommentItem from "./CommentItem";
import CommentAnswerItem from "./CommentAnswerItem";

export default function Comments({ comments }: { comments: CommentType[] }) {
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment: CommentType) => {
        return (
          <div key={comment.id}>
            {/* <p>{comment.user.login}</p>
            <p>{comment.text}</p> */}
            <CommentItem comment={comment} />
            <div>
              {comment.comments.map((answer: CommentType) => {
                return (
                  // <div key={answer.id}>
                  //   <p>{answer.user.login}</p>
                  //   <p>{answer.text}</p>
                  // </div>
                  <CommentAnswerItem
                    comment={answer}
                    commentParentId={comment.id}
                    key={answer.id}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
