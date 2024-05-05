"use client";

import { getOrganizationEvents } from "@/helper/data";
import { EventType } from "@/helper/types";
import { useMyUser } from "@/store/users";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const { myUser } = useMyUser();
  const [events, setEvents] = useState<EventType[]>();

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getOrganizationEvents(myUser.id);
      console.log(response);
      setEvents(response);
    };

    fetchEvents();
  }, [myUser.id]);

  return (
    // <div>
    //   <h1>My events</h1>

    //   <ul>
    //     {events &&
    //       events?.map((event) => (
    //         <Link href={`/event/${event.id}`} key={event.id}>
    //           <li>
    //             <Image
    //               src={`http://localhost:3001/api/event/preview/${event.id}`}
    //               alt="Event Preview"
    //               width={260}
    //               height={200}
    //             />
    //             <p>{event.name}</p>
    //             <p>{event.content}</p>
    //             <p>{moment(event.start).format("LLL")}</p>
    //             <p>{moment(event.end).format("LLL")}</p>
    //             <p>{event.format}</p>
    //             <p>{event.price}</p>
    //           </li>
    //         </Link>
    //       ))}
    //   </ul>
    // </div>

    <div className="flex flex-col gap-4">
      {events?.map((event) => (
        <Link href={`/event/${event.id}`} key={event.id}>
          {/* <li>{event.event.name}</li> */}
          <div
            key={event.id}
            className="flex flex-row justify-center border-2 border-[#f1f5f9] bg-[#f1f5f9] rounded-[8px] p-4 gap-4 mb-4"
          >
            <Image
              src={`http://localhost:3001/api/event/preview/${event.id}`}
              alt="Event Preview"
              width={260}
              height={200}
            />
            <div className="flex flex-col gap-4">
              <div>
                <div className="font-[500] text-[24px]">{event.name}</div>
                <div className=" pl-[10px] border-l border-gray-400">
                  {event.content.slice(0, 300)}...
                </div>
              </div>
              <div className="flex gap-2">
                <div className="">Ticket price:</div>
                <div>
                  <span className=" bg-white rounded-[6px] p-2">
                    {event.price} ₴
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="">Duration:</div>
                <div>
                  <span className=" bg-white rounded-[6px] p-2">
                    {moment(event.start).format("MMMM DD, YYYY")}
                  </span>{" "}
                  –{" "}
                  <span className=" bg-white rounded-[6px] p-2">
                    {moment(event.end).format("MMMM DD, YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
