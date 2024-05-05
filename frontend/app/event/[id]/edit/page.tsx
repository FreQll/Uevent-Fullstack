"use client";

import { getAllTopics, getEventById, getEventTopics } from "@/helper/data";
import EditEventForm from "@/components/ui/events/EditForm";
import EditPreviewForm from "@/components/ui/events/EditPreviewForm";
import Footer from "@/components/Footer";
import { useMyUser } from "@/store/users";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { EventType } from "@/helper/types";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const [event, setEvent] = useState<EventType>();
  const [eventTopics, setEventTopics] = useState();
  const [allTopics, setAllTopics] = useState();

  const { myUser } = useMyUser();

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await getEventById(id);
      setEvent(response);
    };

    const fetchEventTopics = async () => {
      const response = await getEventTopics(id);
      setEventTopics(response);
    };

    const fetchAllTopics = async () => {
      const response = await getAllTopics();
      setAllTopics(response);
    };

    fetchEvent();
    fetchEventTopics();
    fetchAllTopics();
  }, [id]);

  // const [event, eventTopics, allTopics] = await Promise.all([
  //   getEventById(id),
  //   getEventTopics(id),
  //   getAllTopics(),
  // ]);

  // useEffect(() => {
  //   if (myUser.id !== event?.userId) {
  //     redirect(`/event/${id}`);
  //   }
  // }, [id, myUser.id, event?.userId]);

  if (!myUser) {
    return <div>Loading</div>;
  }

  if (!myUser.id) {
    // window.location.href = "/login";
    setTimeout(() => {
      if (!myUser.id || myUser.type !== "ORGANIZATION") {
        redirect("/login");
      }
    }, 5000);
  }

  if (myUser.id !== event?.userId) {
    console.log(myUser.id, event?.userId);

    setTimeout(() => {
      if (myUser.id !== event?.userId) {
        console.log(myUser.id, event?.userId);
        redirect(`/event/${id}`);
      }
    }, 5000);
  }

  // console.log(eventTopics);

  return (
    <div>
      {/* <EditPreviewForm id={id} /> */}

      {event && <EditEventForm event={event} id={id} />}
      <Footer />
    </div>
  );
}
