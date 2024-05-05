import prisma from "../DB/db.config.js";
import { UserType } from "../helper/enums.js";
import { generateRandomCode, jwtGenerator } from "../tools/auth.js";

import bcrypt from "bcrypt";
import { sendEmail } from "../tools/sendEmail.js";
import { resetPasswordHTML } from "../public/emails/resetPasswordHTML.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid input." });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  let token = jwtGenerator(
    user.id,
    user.email,
    user.full_name,
    user.isUserVisible
  );

  const protectedUser = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    isUserVisible: user.isUserVisible,
    type: user.type,
    token,
  };

  return res.status(200).json(protectedUser);
};

export const register = async (req, res) => {
  const { email, password, full_name, type } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ message: "Invalid input." });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let userType = UserType.USER;

  if (type || type === "organization" || type === "ORGANIZATION") {
    userType = UserType.ORGANIZATION;
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      full_name,
      type: userType,
    },
  });

  const protectedUser = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    isUserVisible: user.isUserVisible,
    type: user.type,
  };

  return res.status(200).json({ user: protectedUser });
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const resetCode = generateRandomCode();
  const resetCodeCrypted = await bcrypt.hash(resetCode.toString(), 10);

  await prisma.resetPasswordCode.create({
    data: {
      userId: user.id,
      token: resetCodeCrypted,
      expirationTime: new Date(Date.now() + 60 * 60 * 1000), //* 1 hour
    },
  });

  await sendEmail(
    email,
    "🔒 Password Reset 🔒",
    resetPasswordHTML(user.full_name, resetCode)
  );

  return res.status(200).json({ message: "Reset link sent." });
};

export const confirmResetPassword = async (req, res) => {
  const { newPassword, code, email } = req.body;

  if (!newPassword || !code || !email) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const resetCode = await prisma.resetPasswordCode.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!resetCode) {
    return res.status(404).json({ message: "Reset code not found." });
  }

  const isCodeValid = await bcrypt.compare(code, resetCode.token);

  if (!isCodeValid) {
    return res.status(401).json({ message: "Invalid reset code." });
  }

  if (resetCode.expirationTime < new Date()) {
    return res.status(401).json({ message: "Reset code expired." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.resetPasswordCode.delete({
    where: {
      id: resetCode.id,
    },
  });

  return res.status(200).json({ message: "Password changed." });
};
