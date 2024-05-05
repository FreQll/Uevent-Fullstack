"use client";

import Footer from "@/components/Footer";
import CreateEventForm from "@/components/ui/events/CreateEventForm";
import EventForm from "@/components/ui/events/CreateEventForm";
import { useMyUser } from "@/store/users";
import { redirect } from "next/navigation";

export default function Page() {
  const [myUser, axiosGetWithToken] = useMyUser((state) => [
    state.myUser,
    state.axiosGetWithToken,
  ]);
  if (!myUser) {
    return <div>Loading</div>;
  }
  if (!myUser.id) {
    // window.location.href = "/login";
    setTimeout(() => {
      if (!myUser.id) {
        redirect("/login");
      }
    }, 5000);
  }
  if (myUser.type !== "ORGANIZATION") {
    setTimeout(() => {
      if (!myUser.id) {
        redirect("/login");
      }
    }, 5000);
  }
  return (
    <div className=" max-w-[1300px] w-[100%] m-auto px-[20px] mt-4">
      <h1 className="font-[500] text-[24px] mb-2">Create Event</h1>
      <CreateEventForm userId={myUser.id} />
      <Footer />
    </div>
  );
}
