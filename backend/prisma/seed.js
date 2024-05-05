import prisma from "../DB/db.config.js";
import { faker } from "@faker-js/faker";

// model User {
//     id          String    @id @default(uuid())
//     email       String
//     login       String?
//     password    String
//     full_name   String
//     type        UserType
//     events      Event[]   // User can have multiple events
//     resetCodes  ResetPasswordCode[] // User can have multiple reset codes
//     comments    Comment[] // User can have multiple comments
//     commentAnswers CommentAnswer[] // User can have multiple comment answers
//     likes       Like[]    // User can have multiple likes
//     tickets     Ticket[]  // User can have multiple tickets
//     topics      Topic[]   // User can have multiple topics
//   }

//   // ResetPasswordCode model
//   model ResetPasswordCode {
//     id              String    @id @default(uuid())
//     userId          String
//     token           String
//     expirationTime DateTime
//     createdAt       DateTime @default(now())
//     user            User      @relation(fields: [userId], references: [id])
//   }

//   // Event model
//   model Event {
//     id          String    @id @default(uuid())
//     userId      String
//     name        String
//     content     String
//     latitude    Float
//     longitude   Float
//     start       DateTime
//     end         DateTime
//     format      EventFormat
//     createdAt   DateTime @default(now())
//     user        User      @relation(fields: [userId], references: [id])
//     topics      EventTopics[] // Event can have multiple topics
//     comments    Comment[] // Event can have multiple comments
//     likes       Like[]    // Event can have multiple likes
//     tickets     Ticket[]  // Event can have multiple tickets
//   }

//   // Topic model
//   model Topic {
//     id          String    @id @default(uuid())
//     name        String
//     userId      String
//     createdAt   DateTime @default(now())
//     user        User      @relation(fields: [userId], references: [id])
//     events      EventTopics[] // Topic can have multiple events
//   }

//   // EventTopics model (many-to-many relationship between Event and Topic)
//   model EventTopics {
//     id          String    @id @default(uuid())
//     eventId     String
//     topicId     String
//     event       Event     @relation(fields: [eventId], references: [id])
//     topic       Topic     @relation(fields: [topicId], references: [id])
//   }

//   // Like model
//   model Like {
//     id          String    @id @default(uuid())
//     eventId     String
//     userId      String
//     type        LikeType
//     event       Event     @relation(fields: [eventId], references: [id])
//     user        User      @relation(fields: [userId], references: [id])
//   }

//   // Ticket model
//   model Ticket {
//     id          String    @id @default(uuid())
//     eventId     String
//     userId      String
//     createdAt   DateTime @default(now())
//     event       Event     @relation(fields: [eventId], references: [id])
//     user        User      @relation(fields: [userId], references: [id])
//   }

//   // Comment model
//   model Comment {
//     id          String    @id @default(uuid())
//     eventId     String
//     userId      String
//     text        String
//     comments    CommentAnswer[] // Comment can have multiple answers
//     event       Event     @relation(fields: [eventId], references: [id])
//     user        User      @relation(fields: [userId], references: [id])
//   }

//   // CommentAnswer model
//   model CommentAnswer {
//     id          String    @id @default(uuid())
//     commentId   String
//     userId      String
//     text        String
//     comment     Comment   @relation(fields: [commentId], references: [id])
//     user        User      @relation(fields: [userId], references: [id])
//   }

//   // UserType enum
//   enum UserType {
//     ADMIN
//     USER
//   }

//   // EventFormat enum
//   enum EventFormat {
//     TRAINING
//     SEMINAR
//     MASTER_CLASS
//     DEBATE
//     PARTY
//     EXHIBITION
//     CARNIVAL
//     CONTEST
//     PARADE
//     PICKET
//     PICNIC
//   }

//   // LikeType enum
//   enum LikeType {
//     LIKE
//     DISLIKE
//   }

async function main() {
  const users = [];
  const events = [];
  const topics = [];
  const comments = [];
  const commentsAnswers = [];
  const likes = [];
  const tickets = [];

  // Create users
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        full_name: faker.person.fullName(),
        type: "USER",
      },
    });
    users.push(user);
  }

  const eventFormats = [
    "TRAINING",
    "SEMINAR",
    "MASTER_CLASS",
    "DEBATE",
    "PARTY",
    "EXHIBITION",
    "CARNIVAL",
    "CONTEST",
    "PARADE",
    "PICKET",
    "PICNIC"
  ];

  // Create events
  for (let i = 0; i < 10; i++) {
    let location = await faker.location.nearbyGPSCoordinate({
      origin: [50.450001, 30.523333],
      radius: 10,
      distance: 10,
      isMetric: true,
    }); // All the roads lead to Kyiv)
    // console.log("!!!!!!!!!!!!");
    // console.log(location);
    // console.log("!!!!!!!!!!!!");
    const event = await prisma.event.create({
      data: {
        userId: users[Math.floor(Math.random() * users.length)].id,
        name: faker.company.catchPhrase(),
        content: faker.word.words({ count: { min: 50, max: 200 } }),
        latitude: location[0],
        longitude: location[1],
        // latitude: faker.location.latitude(),
        // longitude: faker.location.longitude(),
        start: faker.date.future(),
        end: faker.date.future(),
        format: eventFormats[Math.floor(Math.random() * eventFormats.length)],
        price: Math.floor(Math.random() * 500),
        maxTickets: Math.floor(Math.random() * 100) + 1,
      },
    });
    events.push(event);
  }

  // Create topics
  topics.push(
    await prisma.topic.create({ data: { name: "Music", userId: users[0].id } })
  );
  topics.push(
    await prisma.topic.create({ data: { name: "Sport", userId: users[1].id } })
  );
  topics.push(
    await prisma.topic.create({ data: { name: "Art", userId: users[2].id } })
  );
  topics.push(
    await prisma.topic.create({
      data: { name: "Science", userId: users[3].id },
    })
  );
  topics.push(
    await prisma.topic.create({
      data: { name: "Technology", userId: users[4].id },
    })
  );

  // Connect events to topics
  for (const event of events) {
    const shuffledTopics = topics.sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 5) + 1;
    const selectedTopics = shuffledTopics.slice(0, count);
  
    for (const topic of selectedTopics) {
      await prisma.eventTopics.create({
        data: {
          eventId: event.id,
          topicId: topic.id,
        },
      });
    }
  }

  // Create comments
  for (let i = 0; i < 10; i++) {
    const comment = await prisma.comment.create({
      data: {
        eventId: events[Math.floor(Math.random() * events.length)].id,
        userId: users[Math.floor(Math.random() * users.length)].id,
        text: faker.lorem.paragraph(),
      },
    });
    comments.push(comment);
  }

  // Create comment answers
  for (let i = 0; i < 10; i++) {
    const commentAnswer = await prisma.commentAnswer.create({
      data: {
        commentId: comments[Math.floor(Math.random() * comments.length)].id,
        userId: users[Math.floor(Math.random() * users.length)].id,
        text: faker.lorem.paragraph(),
      },
    });
    commentsAnswers.push(commentAnswer);
  }

  // Create likes
  for (let i = 0; i < 20; i++) {
    let eventId = events[Math.floor(Math.random() * events.length)].id;
    let userId = users[Math.floor(Math.random() * users.length)].id;
    if (
      likes.find((like) => like.eventId === eventId && like.userId === userId)
    ) {
      continue;
    }
    const like = await prisma.like.create({
      data: {
        eventId: eventId,
        userId: userId,
      },
    });
    likes.push(like);
  }

  // Create tickets
  for (let i = 0; i < 10; i++) {
    let eventId = events[Math.floor(Math.random() * events.length)].id;
    let userId = users[Math.floor(Math.random() * users.length)].id;
    if (
      tickets.find(
        (ticket) => ticket.eventId === eventId && ticket.userId === userId
      )
    ) {
      continue;
    }
    const ticket = await prisma.ticket.create({
      data: {
        eventId: eventId,
        userId: userId,
      },
    });
    tickets.push(ticket);
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
