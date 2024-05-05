import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const isAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next();
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired." });
  }
};