import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import Stripe from "stripe";
import { generateTicket } from "../controllers/ticketController.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Using Express
const router = Router();

// Use body-parser to retrieve the raw body as a buffer

const fulfillOrder = (customer) => {
  // TODO: fill me in
  // console.log("Fulfilling order", lineItems);
  generateTicket(customer.metadata.userId, customer.metadata.eventId);
};

router.use(bodyParser.raw({ type: "application/json" }));

router.post("/webhook", async (request, response) => {
  console.log("IM HERE 1");
  const payload = request.body;
  const sig = request.headers["stripe-signature"];

  // console.log("Payload:", payload);
  // console.log(process.env.STRIPE_ENDPOINT_SECRET);
  // console.log(payload);

  let event;

  if (process.env.STRIPE_SECRET_KEY) {
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_ENDPOINT_SECRET
      );
      console.log("Webhook verified");
    } catch (err) {
      console.log(err);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["line_items"],
        }
      );
      const lineItems = sessionWithLineItems.line_items;

      const customerId = event.data.object.customer;
      const customer = await stripe.customers.retrieve(customerId);
      console.log("Customer:", customer);

      // Fulfill the purchase...
      fulfillOrder(customer);
    }
  }

  response.status(200).end();
});

export default router;
