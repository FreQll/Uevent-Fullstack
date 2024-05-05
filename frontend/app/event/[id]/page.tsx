"use client";

import axios, { POST_CONFIG } from "@/helper/axios";
import {
  getEventById,
  getEventComments,
  getEventTopics,
  getLikesUnderEvent,
  getRemainingTicketsCount,
  getUsersWhoGoToEvent,
} from "@/helper/data";
import Map from "@/components/ui/Map";
import Comments from "@/components/ui/comments/Comments";
import NewCommentForm from "@/components/ui/comments/NewCommentForm";
import Like from "@/components/ui/like";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Badge } from "@/components/ui/badge";
import { AddressFormats, getAddressByCoords } from "@/helper/location";
import moment from "moment";
import { notFound } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useMyUser } from "@/store/users";
import Footer from "@/components/Footer";
import { createTicket, deleteEvent } from "@/helper/actions";
import { Pen, Trash } from "lucide-react";
import Link from "next/link";

type Event = {
  id: string;
  userId: string;
  name: string;
  content: string;
  latitude: number;
  longitude: number;
  start: string;
  end: string;
  format: string;
  createdAt: string;
  price: number;
  maxTickets: number;
};

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  // const { data: session, status } = useSession();
  // const {myUser} = useMyUser()

  const [event, setEvent] = useState<Event>();
  const [eventTopics, setEventTopics] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [remainingTicketsCount, setRemainingTicketsCount] = useState(0);
  const [usersWhoGoToEvent, setUsersWhoGoToEvent] = useState([]);
  const [notFoundError, setNotFoundError] = useState<boolean>(false); // New state to track not found error
  const [address, setAddress] = useState({
    city: "",
    address: "",
  });

  const [myUser, axiosGetWithToken] = useMyUser((state) => [
    state.myUser,
    state.axiosGetWithToken,
  ]);

  const isAuth = myUser.loggedIn;

  console.log(myUser);

  useEffect(() => {
    const fetchData = async () => {
      const [
        event,
        eventTopics,
        comments,
        likes,
        remainingTicketsCount,
        usersWhoGoToEvent,
      ] = await Promise.all([
        getEventById(id),
        getEventTopics(id),
        getEventComments(id),
        getLikesUnderEvent(id),
        getRemainingTicketsCount(id),
        getUsersWhoGoToEvent(id),
      ]);

      if (!event) {
        setNotFoundError(true); // Set notFoundError state to true if event is not found
      } else {
        setEvent(event);
        setEventTopics(eventTopics);
        setComments(comments);
        setLikes(likes);
        setRemainingTicketsCount(remainingTicketsCount);
        setUsersWhoGoToEvent(usersWhoGoToEvent);

        const result = await getAddressByCoords(
          event.latitude,
          event.longitude,
          AddressFormats.SHORT
        );
        const city = await getAddressByCoords(
          event.latitude,
          event.longitude,
          AddressFormats.CITY
        );
        setAddress({
          city: city,
          address: result,
        });
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (event) {
      document.title = event.name || "UEvent";
    }
  }, [event]);

  if (notFoundError) {
    return notFound(); // Return not found page if event is not found
  }

  if (!event) {
    return <div>Loading...</div>; // Render loading indicator while data is being fetched
  }

  const getDaysToGo = () => {
    return moment(event.start).diff(moment(), "days");
  };

  const getDuration = () => {
    console.log(event.start);
    console.log(event.end);

    return moment(event.end).diff(event.start, "hours");
  };

  const buyTicket = async () => {
    if (event?.price === 0) {
      await createTicket({
        userId: myUser.id,
        eventId: id,
      });
    } else {
      console.log(process.env.NEXT_PUBLIC_STRIPE_KEY);
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_KEY as string
      );

      const body = {
        event: event,
        userId: myUser.id,
      };

      console.log(JSON.stringify(body));

      const response = await axios.post(
        `/event/create-checkout-session`,
        JSON.stringify(body),
        POST_CONFIG
      );

      const stripeSession = await response.data;
      const result = await stripe.redirectToCheckout({
        sessionId: stripeSession.id,
      });

      console.log(result);
      console.log(stripeSession);

      if (result.error) {
        console.log(result.error.message);
      }
    }
  };

  const handleDelete = async () => {
    await deleteEvent(id);
  };

  return (
    <div>
      <div className="flex flex-col gap-10">
        <Suspense fallback={<div>Loading info...</div>}>
          <div
            style={{
              backgroundImage: `url(http://localhost:3001/api/event/preview/${id})`,
            }}
            className="w-[100%] min-h-[300px] bg-center bg-cover flex flex-col items-center justify-center relative"
          >
            <h1 className="relative text-center md:text-left text-[36px] md:text-[40px] text-white font-semibold z-[1]">
              {event?.name}
            </h1>
            <div className="gradient absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
          </div>

          <div className="m-auto max-w-[1300px] px-[20px] flex flex-col gap-10 relative">
            <div className="absolute top-[-80px] left-[50%] translate-x-[-50%] rounded-sm border-2 bg-white">
              <div className="grid grid-cols-2 w-max md:flex">
                <div className="flex gap-3 p-4 md:px-8 md:py-5 justify-center items-center border-b font-medium text-[30px] sm:text-nowrap">
                  {getDaysToGo() >= 0 ? (
                    <>
                      {getDaysToGo()}
                      <span className="font-normal text-xs opacity-45 uppercase">
                        Days
                        <br />
                        to go
                      </span>
                    </>
                  ) : (
                    <span className="font-[600] text-xl opacity-45 uppercase text-red-600">
                      Close
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3 p-4 md:px-8 md:py-5  border-l justify-center border-b">
                  <span className="text-black opacity-60 font-medium text-md uppercase sm:text-nowrap">
                    {moment(event?.start).format("MMMM DD, YYYY")}
                  </span>
                  <span className="text-black opacity-45 uppercase text-xs text-nowrap whitespace-normal">
                    Duration: {getDuration()} hours
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4 md:px-8 md:py-5 text-sm border-l justify-center">
                  <span className="text-black opacity-60 font-medium text-md uppercase sm:text-nowrap">
                    {address.city}
                  </span>
                  <span className="text-black opacity-45 uppercase text-xs whitespace-normal text-wrap max-w-[180px]">
                    Location: {address.address}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4 md:px-8 md:py-5  text-sm border-l justify-center">
                  <span className="text-black opacity-60 font-medium text-md uppercase sm:text-nowrap">
                    {event?.maxTickets} participants
                  </span>
                  <span className="text-black opacity-45 uppercase text-xs text-nowrap">
                    {remainingTicketsCount} tickets left
                  </span>
                </div>
                {myUser.id === event.userId && (
                  <div className="flex flex-col gap-3 p-4 md:px-8 md:py-5 text-sm border-l justify-center">
                    <Link href={`/event/${event.id}/edit`}>
                      <span className="text-black opacity-60 font-medium text-md uppercase sm:text-nowrap flex flex-row items-center gap-2">
                        Edit Event <Pen size={16} />
                      </span>
                    </Link>
                    <span
                      onClick={() => handleDelete()}
                      className="text-red-400 uppercase text-xs whitespace-normal text-wrap max-w-[180px] flex flex-row items-center gap-2 cursor-pointer"
                    >
                      Delete Event <Trash size={16} />
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-[130px] md:pt-[60px]">
              <Suspense fallback={<div>Loading topics...</div>}>
                <ul className="flex gap-5 items-center justify-center">
                  {eventTopics &&
                    eventTopics.map((topic: any) => (
                      <Badge
                        className="bg-[var(--blue)] rounded-sm text-white p-1 px-4 hover:bg-[var(--blue)]"
                        key={topic.id}
                      >
                        {topic.name}
                      </Badge>
                    ))}
                </ul>
              </Suspense>
            </div>

            <p className="">{event?.content}</p>
          </div>
        </Suspense>

        {myUser.type !== "ORGANIZATION" && (
          <div className=" bg-gray-200">
            <div className="relative py-8 px-4 bg-center bg-cover bg-no-repeat bg-[url('https://i.pinimg.com/originals/47/bd/6e/47bd6e3a84975c01eeb0d295a64d2a0c.jpg')]">
              <div className="absolute z-0 w-[100%] h-[100%] top-0 left-0 bg-[#272a40d4]"></div>
              <div className="m-auto max-w-[1300px] flex justify-around items-center">
                <span className="font-semibold text-xl text-white relative z-1">
                  Interested to learn more?
                </span>
                <button
                  disabled={getDaysToGo() < 0}
                  onClick={buyTicket}
                  className={`border-2 rounded-sm border-white text-white px-4 py-2 uppercase text-sm relative z-1`}
                >
                  {event?.price === 0 ? "Take Ticket" : "Buy Ticket"}
                </button>
              </div>
            </div>
          </div>
        )}

        {usersWhoGoToEvent.length > 0 && (
          <div className="m-auto max-w-[1300px] w-[100%] px-[20px]">
            <div className="flex justify-between items-center text-center p-4 border rounded-[4px]">
              <div className="text-left">
                <div className="font-[600] text-xl text-nowrap">
                  Don&apos;t know who to go with?
                </div>
                <div>Check the list!</div>
              </div>

              <div className="flex flex-row items-center justify-end w-full max-w-[50%] mr-4">
                <AnimatedTooltip items={usersWhoGoToEvent} />
              </div>
            </div>
          </div>
        )}

        {event.latitude && (
          <div>
            <Suspense fallback={<div>Loading map...</div>}>
              <Map lat={event?.latitude} lng={event?.longitude} />
            </Suspense>
          </div>
        )}

        <div className="m-auto max-w-[1300px] w-[100%] px-[20px] flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <Like likes={likes} eventId={id} />
            <p className="text-sm text-gray-500">
              Created at {moment(event?.createdAt).format("MMMM Do YYYY")}
            </p>
          </div>

          <hr />

          <Suspense fallback={<div>Loading comments...</div>}>
            <div>
              {isAuth && <NewCommentForm eventId={id} userId={myUser.id} />}
              <Comments comments={comments} />
            </div>
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
