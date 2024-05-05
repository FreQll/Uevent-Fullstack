"use client";

import route from "@/api/route";
import { AvatarUpload } from "@/components/UserPage/AvatarUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateUser } from "@/helper/actions";
import { toastError, toastSuccess } from "@/helper/toast";
import { useMyUser } from "@/store/users";
import { set } from "date-fns";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [myUser, axiosPatchWithToken, setMyUser] = useMyUser((state) => [
    state.myUser,
    state.axiosPatchWithToken,
    state.setMyUser,
  ]);

  const isAuth = myUser.loggedIn;

  if (!isAuth) {
    // window.location.href = "/login";
    if (!myUser.id) {
      // window.location.href = "/login";
      setTimeout(() => {
        if (!myUser.id) {
          redirect("/login");
        }
      }, 5000);
    }
  }

  const [fullName, setFullName] = useState(myUser.full_name);
  const [email, setEmail] = useState(myUser.email);
  const [isUserVisible, setIsUserVisible] = useState(myUser.isUserVisible);

  console.log(myUser);

  const handleSubmit = async () => {
    const data = {
      id: myUser.id,
      userId: myUser.id, //! Треба через бек зробить
      full_name: fullName,
      email: email,
      isUserVisible: isUserVisible,
    };

    console.log(data);

    try {
      await axiosPatchWithToken(`${route.serverURL}/user/${myUser.id}`, data);
      setMyUser(data);
      toastSuccess("You have successfully updated your profile!");
    } catch (error) {
      console.log(error);
      toastError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex w-[100%] flex-col gap-4 items-center">
      <div className="flex gap-10 items-center w-[100%]">
        <AvatarUpload />
        <div className="flex flex-col gap-4 w-[-webkit-fill-available]">
          <Input
            value={fullName}
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Label htmlFor="isUserVisibleSwitch">Visible to other users</Label>
            <Switch
              id="isUserVisibleSwitch"
              checked={isUserVisible}
              onCheckedChange={setIsUserVisible}
            />
          </div>
        </div>
      </div>
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
}
