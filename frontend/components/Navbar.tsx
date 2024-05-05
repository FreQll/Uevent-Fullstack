"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useMyUser } from "@/store/users";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  const [myUser, clearMyUser] = useMyUser((state) => [
    state.myUser,
    state.clearMyUser,
  ]);

  // const handleLogout = () => {
  //   console.log("logout");
  //   clearMyUser();
  // };

  return (
    <div className="max-w-[1284px] w-[-webkit-fill-available] px-[20px] py-[20px] my-2 mx-auto flex items-center justify-between sticky top-2 left-0 bg-[#ffffffe3] z-10 backdrop-blur-sm rounded-lg navbar-shadow">
      <Link href={"/"}>UEvent</Link>
      <div className="flex gap-4 items-center text-sm">
        {myUser.loggedIn ? (
          <>
            {/* <Link href={"/mypage"}>{myUser.full_name}</Link> */}
            <UserDropdown />
            {/* <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[var(--red)] rounded-[8px]"
            >
              Logout
            </button> */}
          </>
        ) : (
          <>
            <Link href={"/login"}>Login</Link>
            <Link
              href={"/register"}
              className="px-4 py-2 bg-[var(--blue)] text-white rounded-[8px]"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
