"use client";

import { Button } from "@/components/ui/button";
import { LikeType } from "@/helper/types";
import { useEffect, useState } from "react";
import HeartFilled from "../svg/HeartFilled";
import Heart from "../svg/Heart";
import { createLike, deleteLike } from "@/helper/actions";
import { useMyUser } from "@/store/users";

export default function Like({
  likes,
  eventId,
}: {
  likes: LikeType[];
  eventId: string;
}) {
  const [ myUser,  axiosGetWithToken] = useMyUser((state) => [state.myUser, state.axiosGetWithToken]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes?.length || 0);

  const handleLike = async () => {
    const data = {
      userId: myUser.id,
      eventId: eventId,
    };
    if (myUser.id) {
      if (liked) {
        await deleteLike(data);
        setLikesCount(likesCount - 1);
      } else {
        await createLike(data);
        setLikesCount(likesCount + 1);
      }
      setLiked(!liked);
    }
  }

  useEffect(() => {
    if (myUser?.id) {
      const isLiked = likes.find((like) => like.userId === myUser.id);
      if (isLiked) {
        setLiked(true);
      }
    }
  }, [likes, myUser]);

  return (
    <Button
      onClick={handleLike}
      className={`${!myUser?.id && "cursor-default hover:bg-slate-900"}`}
    >
      {liked ? <HeartFilled /> : <Heart />} {likesCount} likes
    </Button>
  );
}
