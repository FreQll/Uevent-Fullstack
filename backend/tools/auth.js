import jwt from "jsonwebtoken";

export const jwtGenerator = (id, email, full_name, isUserVisible) => {
  return jwt.sign(
    { id: id, email: email, full_name: full_name, isUserVisible: isUserVisible},
    process.env.SECRET_KEY,
    {
      expiresIn: "2h",
    }
  );
};

export const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
