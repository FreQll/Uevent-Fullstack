import axios from "@/helper/axios";
import { Axios, AxiosResponse } from "axios";
import { string } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type myUser = {
  loggedIn: boolean;
  id: string;
  full_name: string;
  email: string;
  isUserVisible: boolean;
  type: string;
}

type useMyUser = {
  myUser: myUser;
  token: string;
  setMyUser: ({
    id,
    full_name,
    email,
    isUserVisible,
    type,
    token,
  }: {
    id: string;
    full_name?: string;
    email?: string;
    isUserVisible?: boolean;
    type?: string;
    token?: string;
  }) => void;
  clearMyUser: () => void;
  axiosGetWithToken: (string: string) => Promise<AxiosResponse<any, any>>;
  axiosPostWithToken: (
    string: string,
    data: any
  ) => Promise<AxiosResponse<any, any>>;
  axiosPatchWithToken: (
    string: string,
    data: any
  ) => Promise<AxiosResponse<any, any>>;
};

export const useMyUser = create<useMyUser>()(
  persist(
    (set, get) => ({
      myUser: {
        loggedIn: false,
        id: "",
        full_name: "",
        email: "",
        isUserVisible: false,
        type: "user",
      },
      token: "",
      setMyUser: ({ id, full_name, email, isUserVisible, type, token }) => {
        console.log("setting my user");
        console.log({ id, full_name, email, isUserVisible, token });
        set({
          myUser: {
            loggedIn: true,
            id: id,
            full_name: full_name ? full_name : get().myUser.full_name,
            email: email ? email : get().myUser.email,
            isUserVisible: isUserVisible  ? isUserVisible : get().myUser.isUserVisible,
            type: type ? type : get().myUser.type,
          },
          token: token ? token : get().token,
        });
      },
      clearMyUser: () => {
        set({
          myUser: {
            loggedIn: false,
            id: "",
            full_name: "",
            email: "",
            isUserVisible: false,
            type: "user",
          },
          token: "",
        });
      },
      axiosGetWithToken: async (string) => {
        return await axios.get(string, {
          headers: {
            Authorization: `Bearer ${get().token}`,
          },
        });
      },
      axiosPostWithToken: async (string, data) => {
        return await axios.post(string, data, {
          headers: {
            Authorization: `Bearer ${get().token}`,
          },
        });
      },
      axiosPatchWithToken: async (string, data) => {
        return await axios.patch(string, data, {
          headers: {
            Authorization: `Bearer ${get().token}`,
          },
        });
      },
    }),
    {
      name: "myUser",
    }
  )
);
