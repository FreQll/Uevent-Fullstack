import prisma from "../DB/db.config.js";
import { generateQR } from "../tools/qrGenerator.js";
import { sendEmailWithAttachment } from "../tools/sendEmail.js";
import { getAddressFromCoordinates } from "../tools/getAddress.js";
import { convertHTMLToPDF } from "../tools/convertHTMLToPDF.js";
import { getHTMLForTicket } from "../tools/getHTMLForTicket.js";
import path from "path";

export const getRemainingTicketsCount = async (req, res) => {
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      eventId: eventId,
    },
  });

  const ticketsCount = event.maxTickets - tickets.length;

  return res.status(200).json({ ticketsCount });
};

export const getUsersWhoGoToEvent = async (req, res) => {
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      eventId: eventId,
      user: {
        isUserVisible: true,
      },
    },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          // login: true,
          full_name: true,
          type: true,
        },
      },
    },
  });

  const ticketsWithImageURL = tickets.map((ticket) => ({
    ...ticket,
    user: {
      ...ticket.user,
      // Construct the image URL based on the user ID
      image: `http://localhost:3001/api/user/avatar/${ticket.user.id}`,
    },
  }));

  //* rewrited this code because else it will return funny results
  const uniqueUsersWithImageURL = ticketsWithImageURL.reduce(
    (unique, ticket) => {
      if (!unique.some((user) => user.id === ticket.user.id)) {
        unique.push(ticket.user);
      }
      return unique;
    },
    []
  );

  // console.log(uniqueUsersWithImageURL);

  return res.status(200).json(uniqueUsersWithImageURL);

  // return res.status(200).json(ticketsWithImageURL.map((ticket) => ticket.user));
};

export const getTicketPDF = async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      event: true,
    },
  });

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  const ticketPath = path.join(
    process.cwd(),
    "public",
    "tickets",
    `${ticketId}.pdf`
  );

  return res.sendFile(ticketPath);
};

export const getUserTickets = async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      userId: userId,
    },
    include: {
      event: true,
    },
  });

  const ticketsWithPath = tickets.map((ticket) => ({
    ...ticket,
    ticket_path: `http://localhost:3001/api/ticket/${ticket.id}`, // Assuming ticket.id exists
    event: ticket.event,
  }));

  return res.status(200).json(ticketsWithPath);
};

export const createTicket = async (req, res) => {
  const { eventId, userId } = req.body;

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

  const tickets = await prisma.ticket.findMany({
    where: {
      eventId: eventId,
    },
  });

  if (tickets.length >= event.maxTickets) {
    return res.status(400).json({ message: "No more tickets available" });
  }

  const ticket = generateTicket(userId, eventId);

  return res.status(201).json(ticket);
};

export const generateTicket = async (userId, eventId) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const ticket = await prisma.ticket.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      event: {
        connect: {
          id: eventId,
        },
      },
    },
  });

  //* Generate a PDF ticket
  const qrCode = await generateQR(`http://localhost:3000/ticket/${ticket.id}`);
  const address = await getAddressFromCoordinates(
    event.latitude,
    event.longitude
  );
  const html = getHTMLForTicket(
    event.id,
    ticket.id,
    qrCode,
    event.name,
    event.start,
    event.end,
    address
  );
  // console.log(html);

  await convertHTMLToPDF(html, `./public/tickets/${ticket.id}.pdf`);
  await sendEmailWithAttachment(
    user.email,
    `Your ticket for ${event.name}`,
    "Your ticket is attached",
    `./public/tickets/${ticket.id}.pdf`
  );

  return ticket;
};
