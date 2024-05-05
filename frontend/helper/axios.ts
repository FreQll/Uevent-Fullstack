import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3001/api",
});

export const POST_CONFIG = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

export const GET_CONFIG = { withCredentials: true };
