import prisma from "../DB/db.config.js";
import { EventFormat } from "../helper/enums.js";
import path from "path";
import Jimp from "jimp";
import fs from "fs";
import mime from "mime-types";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const includeTopics = {
  topics: {
    select: {
      topicId: true,
    },
  },
};
const DEFAULT_TAKE_NUM = 8;

export const getAllEvents = async (req, res) => {
  const events = await prisma.event.findMany();
  if (events.length == 0)
    return res.status(404).json({ message: "Events not found" });

  const eventsWithPagination = await getEventsWithPagination(req, {});
  return res.status(200).json(eventsWithPagination);
};

export const createEvent = async (req, res) => {
  const { userId } = req.params;
  const {
    name,
    content,
    format,
    price,
    maxTickets,
    start,
    end,
    latitude,
    longitude,
  } = req.body;

  const newEvent = await prisma.event.create({
    data: {
      name,
      content,
      format,
      price,
      maxTickets,
      start: new Date(start),
      end: new Date(end),
      latitude,
      longitude,
      userId,
    },
  });

  return res.status(201).json(newEvent);
};

const getEventsWithPagination = async (req, { whereString }) => {
  let { take = 8, skip = 0 } = req.query;

  if (skip < 0) skip = 0;

  const events = await prisma.event.findMany({
    where: whereString,
  });

  const eventsWithPagination = await prisma.event.findMany({
    take: parseInt(take) || DEFAULT_TAKE_NUM,
    skip: parseInt(skip) || 0,
    where: whereString,
    include: includeTopics,
  });

  const total = events.length;

  return {
    data: eventsWithPagination,
    metaData: {
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    },
  };
};

export const getEventById = async (req, res) => {
  const { eventId } = req.params;
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // const eventWithTopic = await getEventWithTopic(event);
  return res.status(200).json(event);
};

export const getEventByName = async (req, res) => {
  const { name } = req.query;

  const events = await getEventsWithPagination(req, {
    whereString: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });

  if (!events) {
    return res.status(404).json({ message: "Events not found" });
  }

  // const eventWithTopic = await getEventWithTopic(events);
  return res.status(200).json(events);
};

// export const searchEvent = async (req, res) => {
//   const { topicName, format, topic } = req.query;

//   const isFormatCorrect = EventFormat[format?.toUpperCase()];

//   if (isFormatCorrect && topic) {
//     console.log("AAA");
//     const events = await getEventsByTopic(req, res);
//     return events;
//   } else if (isFormatCorrect) {
//     const events = await getEventsByFormat(req, res);
//     return events;
//   } else if (topic) {
//     const events = await getEventsByTopic(req, res);
//     return events;
//   } else if (topicName) {
//     if (topicName == "All") {
//       const allEvents = await getEventByName(req, res);
//       return allEvents;
//     }
//     const events = await getEventsByTopic(req, res);
//     return events;
//   }

//   const events = await getEventByName(req, res);
//   return events;
// };

//new search event with universal search
export const searchEvent = async (req, res) => {
  const events = await getEventsByTopicsAndFormat(req, res);
  return events;
};

// EVENT TOPICS METHODS

export const getAllTopics = async (req, res) => {
  //console.log("GETTING ALL TOPICS");
  //console.log("--------------------");
  const topics = await prisma.topic.findMany();
  //console.log(topics);
  //console.log("--------------------");
  return res.status(200).json(topics);
};

export const getTopicById = async (req, res) => {
  const { topicId } = req.params;
  const topic = await prisma.topic.findUnique({
    where: {
      id: topicId,
    },
  });
  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }
  return res.status(200).json(topic);
};

export const getEventTopics = async (req, res) => {
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const topics = await prisma.eventTopics.findMany({
    where: {
      eventId: event.id,
    },
  });

  const topicsInfo = [];

  for (const topic of topics) {
    const data = await prisma.topic.findUnique({
      where: {
        id: topic.topicId,
      },
    });
    if (data) topicsInfo.push(data);
  }

  return res.status(200).json(topicsInfo);
};

// ADDITIONAL FUNCTIONS

const getEventWithTopic = async (event) => {
  const events = await prisma.event.findMany({
    include: {
      topics: {
        select: {
          topicId: true,
        },
      },
    },
  });

  return events;
};

const getEventsByFormat = async (req, res) => {
  const { name, take, skip } = req.query;
  let { format } = req.query;

  console.log("\n\nFORMAT");
  console.log(format);

  if (format.toUpperCase() == "ALL") format = "";

  const events = await prisma.event.findMany({
    where: {
      name: {
        contains: name,
      },
      format: format.toUpperCase(),
    },
  });

  const eventsWithPagination = await prisma.event.findMany({
    take: parseInt(take) || DEFAULT_TAKE_NUM,
    skip: parseInt(skip) || 0,
    where: {
      name: {
        contains: name,
      },
      format: format.toUpperCase(),
    },
    include: includeTopics,
  });

  const total = events.length;

  return res.status(200).json({
    data: eventsWithPagination,
    metaData: {
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    },
  });
};

const getEventsByTopic = async (req, res) => {
  const { topicName, name, take, skip } = req.query;
  let { format } = req.query;

  if (topicName == "All") {
    const events = await getAllEvents(req, res);
    return events;
  }

  if (format?.toUpperCase() == "ALL") {
    format = {};
  }

  const topic = await prisma.topic.findMany({
    where: {
      name: topicName,
    },
  });

  const whereStatement = {
    topics: {
      some: {
        topicId: topic[0].id,
      },
    },
    name: {
      contains: name,
    },
    format: format,
  };

  const events = await prisma.event.findMany({
    where: whereStatement,
  });

  const eventsWithPagination = await prisma.event.findMany({
    take: parseInt(take) || DEFAULT_TAKE_NUM,
    skip: parseInt(skip) || 0,
    include: includeTopics,
    where: whereStatement,
  });

  const total = events.length;

  return res.status(200).json({
    data: eventsWithPagination,
    metaData: {
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    },
  });

  // const topic = await prisma.topic.findMany({
  //   where: {
  //     name: topicName,
  //   },
  // });

  // if (topic.length == 0) {
  //   return { error: "Topic not found" };
  // }

  // const events = await prisma.eventTopics.findMany({
  //   where: {
  //     topicId: topic[0].id,
  //   },
  // });

  // if (events.length == 0) {
  //   return { error: "Events not found" };
  // }

  // const eventIds = events.map((event) => event.eventId);
  // const eventPromises = eventIds.map((eventId) => {
  //   return prisma.event.findMany({
  //     where: {
  //       id: eventId,
  //       ...whereString,
  //     },
  //   });
  // });
  // const eventsInfo = await Promise.all(eventPromises);
  // return eventsInfo.flatMap(events => events);
};

//universal combined search
const getEventsByTopicsAndFormat = async (req, res) => {
  const { topics, format, name, take, skip } = req.query;

  let topicIds = [];

  // Handle case where "All" topics are selected
  if (!topics || topics.length === 0 || topics.includes("All")) {
    topicIds = await prisma.topic.findMany({
      select: {
        id: true,
      },
    });
  }

  topicIds = await prisma.topic.findMany({
    where: {
      name: {
        in: topics,
      },
    },
    select: {
      id: true,
    },
  });
  let events = [];
  let total = 0;

  if (!format || format.toUpperCase() === "ALL") {
    events = await prisma.event.findMany({
      where: {
        AND: [
          {
            topics: {
              some: {
                topicId: {
                  in: topicIds.map((topic) => topic.id),
                },
              },
            },
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      take: parseInt(take) || DEFAULT_TAKE_NUM,
      skip: parseInt(skip) || 0,
      include: includeTopics, // Include any necessary relationships here
    });

    total = await prisma.event.count({
      where: {
        AND: [
          {
            topics: {
              some: {
                topicId: {
                  in: topicIds.map((topic) => topic.id),
                },
              },
            },
            name: {
              contains: name,
            },
          },
        ],
      },
    });
  } else {
    events = await prisma.event.findMany({
      where: {
        AND: [
          {
            topics: {
              some: {
                topicId: {
                  in: topicIds.map((topic) => topic.id),
                },
              },
            },
            format: format,
            name: {
              contains: name,
            },
          },
        ],
      },
      take: parseInt(take) || DEFAULT_TAKE_NUM,
      skip: parseInt(skip) || 0,
      include: includeTopics, // Include any necessary relationships here
    });

    total = await prisma.event.count({
      where: {
        AND: [
          {
            topics: {
              some: {
                topicId: {
                  in: topicIds.map((topic) => topic.id),
                },
              },
            },
            format: format,
            name: {
              contains: name,
            },
          },
        ],
      },
    });
  }

  return res.status(200).json({
    data: events,
    metaData: {
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    },
  });
};

export const getEventPreview = async (req, res) => {
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const previewPath = path.join(
    process.cwd(),
    "public",
    "eventPreviews",
    `${event.id}.png`
  );

  if (fs.existsSync(previewPath)) {
    return res.status(200).sendFile(previewPath);
  }

  const defaultPreviewPath = path.join(
    process.cwd(),
    "public",
    "eventPreviews",
    "default.png"
  );

  return res.status(200).sendFile(defaultPreviewPath);
};

export const updateEventPreview = async (req, res) => {
  const { eventId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file provided." });
  }

  const mimeType = mime.lookup(req.file.originalname);
  console.log(mimeType);
  if (
    !mimeType ||
    !mimeType.startsWith("image/") ||
    mimeType === "image/webp"
  ) {
    return res
      .status(400)
      .json({ message: "Invalid file format. Only images are allowed." });
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const previewPath = path.join(
    process.cwd(),
    "public",
    "eventPreviews",
    `${event.id}.png`
  );

  const resizeWidth = 600;
  const resizeHeight = 400;

  const previewImage = await Jimp.read(req.file.path);
  await previewImage.cover(resizeWidth, resizeHeight).write(previewPath);
  // console.log(req.file.path);
  fs.unlinkSync(req.file.path);

  return res.status(200).json({ message: "Preview updated successfully." });
};

export const editEvent = async (req, res) => {
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const {
    name,
    content,
    format,
    price,
    maxTickets,
    start,
    end,
    latitude,
    longitude,
  } = req.body;

  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      name,
      content,
      format,
      price,
      maxTickets,
      start: new Date(start),
      end: new Date(end),
      latitude,
      longitude,
    },
  });

  return res.status(200).json({ message: "Event updated successfully." });
};

export const createCheckoutSession = async (req, res) => {
  const { event, userId } = req.body;
  // console.log(event);

  // console.log(userId);

  const customer = await stripe.customers.create({
    metadata: {
      userId: userId,
      // event: event,
      eventId: event.id,
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "uah",
          product_data: {
            name: `Ticket - ${event.name}`,
            description: event.content,
          },
          unit_amount: event.price * 100,
        },
        quantity: 1,
      },
    ],
    customer: customer.id,
    mode: "payment",
    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancel",
  });

  // console.log(session.id);
  // console.log(session.url);
  // console.log(customer);
  // console.log(userId);

  return res.status(200).json({ id: session.id });
};

export const deleteEvent = async (req, res) => {
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

  if (likes.length > 0) {
    await prisma.like.deleteMany({
      where: {
        eventId: eventId,
      },
    });
  }

  const eventTopics = await prisma.eventTopics.findMany({
    where: {
      eventId: eventId,
    },
  });

  if (eventTopics.length > 0) {
    await prisma.eventTopics.deleteMany({
      where: {
        eventId: eventId,
      },
    });
  }

  const eventComments = await prisma.comment.findMany({
    where: {
      eventId: eventId,
    },
  });

  if (eventComments.length > 0) {
    await prisma.comment.deleteMany({
      where: {
        eventId: eventId,
      },
    });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      eventId: eventId,
    },
  });

  if (tickets.length > 0) {
    await prisma.ticket.deleteMany({
      where: {
        eventId: eventId,
      },
    });
  }

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  return res.status(200).json({ message: "Event deleted successfully." });
};
