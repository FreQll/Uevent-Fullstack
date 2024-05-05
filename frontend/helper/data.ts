"use server";

import axios, { GET_CONFIG } from "./axios";

export async function getData(link: string, id: string) {
  try {
    const response = await axios.get(`/${link}/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getEventById(id: string) {
  try {
    const response = await axios.get(`/event/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // throw new Error("Event not found");
    // console.error(error);
    return null;
  }
}

export async function getAllTopics() {
  try {
    const response = await axios.get("/event/topic/getAll", GET_CONFIG);
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getEventTopics(id: string) {
  try {
    const response = await axios.get(`/event/topic/info/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // throw new Error("Event not found");
    // console.error(error);
    return null;
  }
}

export async function getEventComments(id: string) {
  try {
    const response = await axios.get(`/comment/event/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getLikesUnderEvent(id: string) {
  try {
    const response = await axios.get(`/likes/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function isUserLikedEvent(eventId: string, userId: string) {
  try {
    const response = await axios.get(
      `/likes/isUserLiked/${userId}/${eventId}`,
      GET_CONFIG
    );
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getRemainingTicketsCount(id: string) {
  try {
    const response = await axios.get(`/ticket/remaining/${id}`, GET_CONFIG);
    return response.data.ticketsCount;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getUsersWhoGoToEvent(id: string) {
  try {
    const response = await axios.get(`/ticket/users/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getUserTickets(id: string) {
  try {
    const response = await axios.get(`/ticket/userTickets/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getTicketPDF(id: string) {
  try {
    const response = await axios.get(`/ticket/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getLikedEventsByUser(id: string) {
  try {
    const response = await axios.get(`/likes/user/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getOrganizationEvents(id: string) {
  try {
    const response = await axios.get(`/user/events/${id}`, GET_CONFIG);
    return response.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}
