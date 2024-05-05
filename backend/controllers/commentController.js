import prisma from "../DB/db.config.js";

export const getEventComments = async (req, res) => {
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const comments = await prisma.comment.findMany({
    where: {
      eventId: eventId,
    },
    include: {
      comments: {
        include: {
          user: {
            select: {
              email: true,
              // login: true,
              full_name: true,
              type: true,
            },
          },
        },
      },
      user: {
        select: {
          email: true,
          // login: true,
          full_name: true,
          type: true,
        },
      },
    },
  });

  return res.status(200).json(comments);
};

export const createComment = async (req, res) => {
  const { userId, eventId, text } = req.body;

  if (!userId || !eventId || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (text.length < 1) {
    return res
      .status(400)
      .json({ message: "Answer must contain at least 1 character" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const newComment = await prisma.comment.create({
    data: {
      userId: userId,
      eventId: eventId,
      text: text,
    },
  });

  res.status(201).json(newComment);
};

export const createAnswerToComment = async (req, res) => {
  const { commentId, userId, text } = req.body;

  if (!commentId || !userId || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (text.length < 1) {
    return res
      .status(400)
      .json({ message: "Answer must contain at least 1 character" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // const event = await prisma.event.findUnique({
  //   where: {
  //     id: eventId,
  //   },
  // });

  // if (!event) {
  //   return res.status(404).json({ message: "Event not found" });
  // }

  const newAnswer = await prisma.commentAnswer.create({
    data: {
      commentId: commentId,
      userId: userId,
      text: text,
    },
  });

  res.status(201).json(newAnswer);
};
