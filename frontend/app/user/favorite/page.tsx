"use client";
import { getLikedEventsByUser } from "@/helper/data";
import { useMyUser } from "@/store/users";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type LikeType = {
  id: string;
  eventId: string;
  userId: string;
  event: {
    id: string;
    name: string;
    userId: string;
    content: string;
    start: Date;
    end: Date;
    format: string;
    price: number;
    createdAt: Date;
  };
};

export default function Page() {
  const [likes, setLikes] = useState<LikeType[]>();
  const { myUser } = useMyUser();

  useEffect(() => {
    const fetchLikes = async () => {
      const response = await getLikedEventsByUser(myUser.id);
      setLikes(response);
    };

    fetchLikes();
  }, [myUser.id]);

  return (
    <div className="flex flex-col gap-4">
      {likes?.map((like) => (
          <Link href={`/event/${like.event.id}`} key={like.id}>
            {/* <li>{like.event.name}</li> */}
            <div
              key={like.id}
              className="flex flex-row justify-center border-2 border-[#f1f5f9] bg-[#f1f5f9] rounded-[8px] p-4 gap-4 mb-4"
            >
              <Image
                src={`http://localhost:3001/api/event/preview/${like.eventId}`}
                alt="Event Preview"
                width={260}
                height={200}
              />
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-[500] text-[24px]">{like.event.name}</div>            
                  <div className=" pl-[10px] border-l border-gray-400">
                    {like.event.content.slice(0, 300)}...
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="">Ticket price:</div>
                  <div>
                    <span className=" bg-white rounded-[6px] p-2">{like.event.price} ₴</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="">Duration:</div>
                  <div>
                    <span className=" bg-white rounded-[6px] p-2">{moment(like.event.start).format("MMMM DD, YYYY")}</span> –{" "}
                    <span className=" bg-white rounded-[6px] p-2">{moment(like.event.end).format("MMMM DD, YYYY")}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
      ))}
    </div>
  );
}
