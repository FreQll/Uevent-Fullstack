"use client";

import { Button } from "@/components/ui/button";
import { getUserTickets } from "@/helper/data";
import { EventType } from "@/helper/types";
import { useMyUser } from "@/store/users";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type TicketProps = {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
  ticket_path: string;
  event: EventType;
};

export default function Page() {
  // const user = useSession();
  const [myUser, axiosGetWithToken] = useMyUser((state) => [
    state.myUser,
    state.axiosGetWithToken,
  ]);

  const [userTickets, setUserTickets] = useState<TicketProps[]>();

  useEffect(() => {
    const fetchUserTickets = async () => {
      const response = await getUserTickets(myUser.id);
      
      setUserTickets(response);
    };
    fetchUserTickets();
  }, [myUser.id]);

  return (
    <div className="flex flex-col gap-4">
      {userTickets?.map((ticket) => (
        <div
          key={ticket.id}
          className="flex flex-row justify-center border-2 border-[#f1f5f9] bg-[#f1f5f9] rounded-[8px] p-4 gap-4 mb-4 "
        >
          <Image
            src={`http://localhost:3001/api/event/preview/${ticket.eventId}`}
            alt="Event Preview"
            width={260}
            height={200}
          />
          {/* <iframe id="iframepdf" src={ticket.ticket_path}></iframe> */}
          <div className="flex flex-col gap-4">
            <Link href={`/event/${ticket.event.id}`} className="font-[500] text-[24px]">{ticket.event.name}</Link>
            <div className=" pl-[10px] border-l border-gray-400">
              {ticket.event.content.slice(0, 300)}...
            </div>
            <div className="flex gap-2">
              <div className="">Duration:</div>
              <div>
                <span className=" bg-white rounded-[6px] p-2">{moment(ticket.event.start).format("MMMM DD, YYYY")}</span> –{" "}
                <span className=" bg-white rounded-[6px] p-2">{moment(ticket.event.end).format("MMMM DD, YYYY")}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="">Ticket price:</div>
              <div>
                <span className=" bg-white rounded-[6px] p-2">{ticket.event.price} ₴</span>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex gap-2">
                <div className="">Ticket purchased:</div>
                <div>
                  <span className=" bg-white rounded-[6px] p-2">{moment(ticket.createdAt).format("MMMM DD, YYYY")}</span>
                </div>
              </div>
              <a
                target="_blank"
                href={`http://localhost:3001/api/ticket/${ticket.id}`}
                rel="noopener noreferrer"
              >
                <Button>Download Ticket</Button>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
