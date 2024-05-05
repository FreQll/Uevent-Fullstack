"use server";

import { EventType } from "@/helper/types";
import axios, { POST_CONFIG } from "./axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTicket(data: { userId: string; eventId: string }) {
  const response = await axios.post(`/ticket/generate`, data, POST_CONFIG);
  revalidatePath(`/event/${data.eventId}`);
  return response.data;
}

export async function updateEvent(id: string, data: EventType) {
  await axios.patch(`/event/edit/${id}`, data);
  revalidatePath(`/event/${id}`);
  redirect(`/event/${id}`);
}

export async function updateEventPreview(id: string, data: FormData) {
  // console.log(data);
  try {
    const response = await axios.patch(`/event/update/preview/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.status;
  } catch (error) {
    // console.log(error);
    return null;
  }
}

export async function createEvent(data: EventType, userId: string) {
  await axios.post(`/event/create/${userId}`, data);
  redirect(`/`);
}

export async function createComment(data: {
  text: string;
  userId: string;
  eventId: string;
}) {
  // console.log(data);
  const response = await axios.post(`/comment/create`, data, POST_CONFIG);
  // console.log(response);
  revalidatePath(`/event/${data.eventId}`);
  return response.data;
}

export async function createReply(data: {
  text: string;
  userId: string;
  commentId: string;
}) {
  // console.log(data);
  const response = await axios.post(
    `/comment/answer/create`,
    data,
    POST_CONFIG
  );
  // console.log(response);
  // revalidatePath(`/event/${data.eventId}`);
  return response.data;
}

export async function createLike(data: { userId: string; eventId: string }) {
  const response = await axios.post(`/likes/create`, data, POST_CONFIG);
  revalidatePath(`/event/${data.eventId}`);
  return response.data;
}

export async function deleteLike(data: { userId: string; eventId: string }) {
  const response = await axios.delete(
    `/likes/delete/${data.userId}/${data.eventId}`
  );
  revalidatePath(`/event/${data.eventId}`);
  return response.data;
}

export async function updateUser(data: {
  full_name: string;
  email: string;
  isUserVisible: boolean;
  userId: string;
}) {
  const response = await axios.patch(`/user/${data.userId}`, data);
  revalidatePath(`/user/my-page`);
  redirect(`/user/my-page`);
  // return response.data;
}

export async function deleteEvent(id: string) {
  await axios.delete(`/event/${id}`);
  revalidatePath(`/`);
  redirect(`/`);
}
