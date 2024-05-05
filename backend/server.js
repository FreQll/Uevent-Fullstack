import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import stripeRouter from "./routes/stripeRouter.js";

import routes from "./routes/index.js";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use("/api/stripe", stripeRouter);

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
dotenv.config();

// * Routes
app.use(routes);

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `Server is alive on http://${process.env.HOST}:${process.env.PORT}`
  );
});
