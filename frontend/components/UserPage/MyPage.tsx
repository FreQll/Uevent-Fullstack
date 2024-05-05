"use client";

import Tickets from "@/app/user/tickets/page";
import Settings from "@/app/user/settings/page";
import Favorite from "@/app/user/favorite/page";
import MyEvents from "@/app/user/my-events/page";
import { useMyUser } from "@/store/users";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBlock from "./UserBlock";

export default function MyPage() {
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

  return (
    <div className="max-w-[1284px] w-[100%] px-[20px] mx-auto ">
      {myUser.loggedIn ? (
        <div>
          <h1 className=" text-2xl text-center my-4">My Page</h1>

          <div className="flex flex-row items-center">
            <Tabs defaultValue="account" className="w-[100%]">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                {myUser.type === "ORGANIZATION" ? (
                  <>
                    <TabsTrigger value="my-events">My Events</TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                    <TabsTrigger value="favorite">Favorite Events</TabsTrigger>
                  </>
                )}
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <UserBlock user={myUser} />
              </TabsContent>
              {myUser.type === "ORGANIZATION" ? (
                <>
                  <TabsContent value="my-events">
                    <MyEvents />
                  </TabsContent>
                </>
              ) : (
                <>
                  <TabsContent value="tickets">
                    <Tickets />
                  </TabsContent>
                  <TabsContent value="favorite">
                    <Favorite />
                  </TabsContent>
                </>
              )}
              <TabsContent value="settings" className="w-[100%]">
                <Settings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
