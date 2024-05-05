import route from "@/api/route";
import axios from "@/helper/axios";
import { getAddressByCoords } from "@/helper/location";
import { EventType } from "@/helper/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type EventCard = {
  event: EventType;
};

type Topic = {
  name: string;
};

const EventCard = ({ event }: EventCard) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [address, setAddress] = useState('');

  const getTopics = async () => {
    const topics = await axios.get(
      `${route.serverURL}/event/topic/info/${event.id}`
    );
    return topics.data;
  };

  const getMonth = (date: Date) => {
    const monthsAbbreviation = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthsAbbreviation[new Date(date).getMonth()]
  }

  useEffect(() => {
    const fetchTopics = async () => {
      const topics = await getTopics();
      setTopics(topics);
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const result = await getAddressByCoords(event.latitude, event.longitude);
        setAddress(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAddress();
  }, [event.latitude, event.longitude]);


  return (
      <li className="relative max-w-none rounded overflow-hidden shadow-lg">
        <div className={`absolute px-2 py-1 rounded-[10px] top-2 left-2 bg-white text-sm font-semibold ${event.price === 0 && 'bg-green-400'}`}>
          {event.price === 0 ? <p>Free</p> : <p>{event.price}&#8372;</p>}
        </div>
        <Link href={`/event/${event.id}`}>
          <div 
            style={{ 'backgroundImage': `url(http://localhost:3001/api/event/preview/${event.id})` }}
            className={`w-[100%] h-[300px] bg-cover bg-center`}>

          </div>
        </Link>
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="flex gap-6">
            <div className="flex flex-col g-2 items-center justify-center">
              <div className="uppercase text-violet-400 font-semibold text-sm">{getMonth(event.start)}</div>
              <div className="uppercase font-semibold text-lg">{new Date(event.start).getDate()}</div>
            </div>
            
            <div className="overflow-hidden">
              <Link href={`/event/${event.id}`}>
                <div className="font-semibold text-lg mb-2 text-nowrap overflow-ellipsis overflow-hidden">{event.name}</div>
              </Link>
              <p className="text-gray-700 text-base">
                {address}
              </p>
            </div>
          </div>

          <div>
            {topics?.map((topic, index) => (
              <span key={index} className="inline-block rounded-full text-sm font-semibold text-gray-500 mr-2 mb-2">#{topic.name}</span>
            ))}
          </div>
        </div>
      </li>

  );
};

export default EventCard;


      {/* <div>{event.format}</div>

      {event.price === 0 ? <p>Free</p> : <p>Price: {event.price} &#8372;</p>} */}