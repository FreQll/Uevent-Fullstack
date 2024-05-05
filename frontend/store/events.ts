import route from "@/api/route";
import axios from "@/helper/axios";
import { EventFormat, findKeyByValue } from "@/helper/enums";
import { EventType } from "@/helper/types";
import { AxiosRequestConfig } from "axios";
import { revalidatePath, revalidateTag } from "next/cache";
import { create } from "zustand";

export type EventTopic = {
  id: string;
  name: string;
  userId: string;
};

type AllEvents = {
  data: EventType[];
  metaData: {
    totalPages: number;
  };
};

type useEvents = {
  loading: boolean;
  nameToSearch: string;
  formatToSearch: EventFormat;
  topicsToSearch: string[];
  allTopics: EventTopic[];
  allEvents: AllEvents;
  setAllEvents: ({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }) => Promise<void>;
  searchEvents: ({
    name,
    format,
    topics,
    take,
    skip,
  }: {
    name?: string;
    format?: string;
    topics?: string[];
    take: number;
    skip: number;
  }) => Promise<void>;
  setAllTopics: () => Promise<void>;
  // filterEvents: (filterName: string) => Promise<void>,
};

export const useEvents = create<useEvents>((set, get) => ({
  loading: false,
  nameToSearch: "",
  formatToSearch: EventFormat.ALL,
  topicsToSearch: [],
  allTopics: [],
  allEvents: {
    data: [],
    metaData: {
      totalPages: 0,
    },
  },
  setAllEvents: async ({ take, skip }) => {
    set({ loading: true });
    if (
      get().formatToSearch === EventFormat.ALL &&
      get().nameToSearch === "" &&
      (get().topicsToSearch == undefined || get().topicsToSearch.length === 0)
    ) {
      const events = await axios.get(
        `${route.serverURL}/event?take=${take}&skip=${skip}`
      );
      console.log("making request", events.data);

      set({
        loading: false,
        allEvents: events.data,
      });
    } else {
      get().searchEvents({
        name: get().nameToSearch,
        format: get().formatToSearch,
        topics: get().topicsToSearch,
        take: take,
        skip: skip,
      });
    }
  },
  searchEvents: async ({ name, format, topics, take, skip }) => {
    set({ loading: true });
    if (name == undefined) name = get().nameToSearch;
    if (topics == undefined) topics = get().topicsToSearch;
    if (format == undefined) format = get().formatToSearch;
    else {
      format = findKeyByValue(format.toLowerCase() as string) as string;
    }
    const events = await axios.get(`${route.serverURL}/event/search/filters`, {
      params: {
        name: name,
        format: format,
        topics: topics,
        take: take,
        skip: skip,
      },
    });
    set({
      loading: false,
      allEvents: events.data,
      nameToSearch: name,
      topicsToSearch: topics,
      formatToSearch: format?.toUpperCase() as EventFormat,
    });
  },
  setAllTopics: async () => {
    const topics = await axios.get(`${route.serverURL}/event/topic/getAll`);
    set({ allTopics: topics.data });
  },
}));
