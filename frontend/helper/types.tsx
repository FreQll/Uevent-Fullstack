import { EventFormat } from "./enums";

export type EventType = {
  id: string;
  userId: string;
  name: string;
  content: string;
  start: Date;
  end: Date;
  format: EventFormat;
  createdAt: Date;
  latitude: number;
  longitude: number;
  topics: TopicType[];
  price: number;
  maxTickets: number;
};

export type TopicType = {
  topicId: string;
  name: string;
  userId: string;
  createdAt: Date;
};

export type UserType = {
  email: string;
  login: string;
  full_name: string;
  type: "USER" | "ADMIN";
};

export type CommentType = {
  id: string;
  eventId: string;
  userId: string;
  text: string;
  user: UserType;
  comments: CommentType[];
  createdAt: Date;
  editedAt: Date;
};

export type LikeType = {
  id: string;
  userId: string;
  eventId: string;
};
