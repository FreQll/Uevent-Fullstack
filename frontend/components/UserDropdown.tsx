"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserType } from "@/helper/types";
import { useMyUser } from "@/store/users";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEvents } from "@/store/events";

export default function UserDropdown() {
  const [myUser, clearMyUser] = useMyUser((state) => [
    state.myUser,
    state.clearMyUser,
  ]);

  //   const isAuth = myUser.loggedIn;

  const handleLogout = () => {
    console.log("logout");
    clearMyUser();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex flex-row gap-2 items-center justify-center">
          {myUser.full_name}
          <Image
            src={`http:localhost:3001/api/user/avatar/${myUser.id}`}
            alt="Avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/user/my-page"}>Profile</Link>
        </DropdownMenuItem>
        {myUser.type === "ORGANIZATION" && (
          <>
            <DropdownMenuItem>
              <Link href={"/event/create"}>Create New Event</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem>
          <div onClick={handleLogout}>Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
