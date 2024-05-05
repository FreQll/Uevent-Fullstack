import prisma from "../DB/db.config.js";

export const getLikesUnderEvent = async (req, res) => {
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const likes = await prisma.like.findMany({
    where: {
      eventId: eventId,
    },
  });

  return res.status(200).json(likes);
};

export const getLikedEventsByUser = async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const likes = await prisma.like.findMany({
    where: {
      userId: userId,
    },
    include: {
      event: true,
    },
  });

  return res.status(200).json(likes);
};

export const isUserLikedEvent = async (req, res) => {
  const { userId, eventId } = req.params;

  if (!userId || !eventId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const like = await prisma.like.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
    },
  });

  return res.status(200).json(like);
};

export const createLike = async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
    },
  });

  if (existingLike) {
    return res.status(400).json({ message: "Like already exists" });
  }

  const like = await prisma.like.create({
    data: {
      userId: userId,
      eventId: eventId,
    },
  });

  return res.status(201).json(like);
};

export const deleteLike = async (req, res) => {
  const { userId, eventId } = req.params;

  const like = await prisma.like.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
    },
  });

  if (!like) {
    return res.status(404).json({ message: "Like not found" });
  }

  await prisma.like.delete({
    where: {
      id: like.id,
    },
  });

  return res.status(204).json();
};
