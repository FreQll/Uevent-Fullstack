"use client";

import MyPage from "@/components/UserPage/MyPage";
import { useMyUser } from "@/store/users";

export default function Mypage() {
  const [myUser, axiosGetWithToken] = useMyUser((state) => [
    state.myUser,
    state.axiosGetWithToken,
  ]);
  return <MyPage />;
}
