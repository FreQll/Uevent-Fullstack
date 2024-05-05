"use client";

import route from "@/api/route";
import { shallow } from "zustand/shallow";
import { EventFormat } from "@/helper/enums";
import { EventType, TopicType } from "@/helper/types";
import React, { useEffect, useState } from "react";
import SearchEvent from "./SearchEvent";
import { useEvents } from "@/store/events";
import EventFormatFilter from "./EventFormatFilter";
import Link from "next/link";
import Image from "next/image";
import Pagination from "../Pagination";
import { PageProps } from "@/.next/types/app/page";
import { revalidatePath } from "next/cache";
import EventCard from "./EventCard";
import EventTopicsFilter from "./EventTopicsFilter";

type TopicArray = {
  eventId: string;
  topic: TopicType[];
};

const PAGE_SIZE = 9;

export default function AllEventsList(props: PageProps) {
  const [allEvents, setAllEvents, loading] = useEvents((state) => [
    state.allEvents,
    state.setAllEvents,
    state.loading,
  ]);
  const take = PAGE_SIZE;
  const pageNumber = props?.searchParams?.page || 1;
  const skip = (pageNumber - 1) * take;

  console.log(allEvents);

  useEffect(() => {
    setAllEvents({ take, skip });
  }, [props, setAllEvents, skip, take]);

  const events = allEvents?.data?.map((event: EventType, index) => {
    return <EventCard event={event} key={index} />;
  });

  return (
    <div
      className={`m-auto max-w-[1300px] px-[20px] flex flex-col gap-10 relative w-[100%]`}
    >
      <EventTopicsFilter pageSize={PAGE_SIZE} props={props} />
      <div className="flex justify-between items-center">
        <h1 className="text-[#2b2b2b] font-bold text-[36px] leading-[100%]">
          Current events
        </h1>
        <div className="flex gap-2 items-center">
          <SearchEvent pageSize={PAGE_SIZE} props={props} />
        </div>
      </div>
      <div>
        <EventFormatFilter pageSize={PAGE_SIZE} props={props} />
        <EventTopicsFilter pageSize={PAGE_SIZE} props={props} />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-8">
          <ul className="all-events-grid gap-4">{events}</ul>
          {events.length < allEvents?.metaData?.totalPages * take && (
            <Pagination
              page={pageNumber}
              totalPages={allEvents?.metaData?.totalPages}
            />
          )}
        </div>
      )}
    </div>
  );
}
