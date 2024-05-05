"use client";
import route from "@/api/route";
import axios from "../../../helper/axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Register({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!email) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(`${route.serverURL}/auth/reset`, {
        email: email,
      });
      if (response.status === 200) {
        window.location.href = "/login/reset/confirm";
      }
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again later.";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh]">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between pr-[10%] lg:pr-[20%] h-[100%]">
        <div className="w-[50%] h-[100%]">
          <div className=" absolute top-0 left-0 w-[40%] h-[100%] bg-center bg-cover bg-[url('https://i.pinimg.com/originals/14/19/d4/1419d4bd43cc6587dc6a0dce1ccf1da9.jpg')]"></div>
        </div>
        <div className="flex flex-col p-8 min-w-[400px] gap-4">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="uppercase text-[var(--dark-blue)] font-[600] text-[24px]">
              Password Reset
            </h1>
            <Link
              href={"/login/reset/confirm"}
              className="text-[14px] text-[var(--dark-blue)] bg-transparent"
            >
              I already have a code
            </Link>
          </div>
          <form className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="w-[100%]"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="registerError">{error}</div>
            <Button
              type="button"
              onClick={handleReset}
              className={"w-[100%] bg-[var(--dark-blue)]"}
            >
              Send reset code to my email
            </Button>

            {/* <Link
              href={"/login"}
              className="text-[14px] text-[var(--dark-blue)] bg-transparent text-center"
            >
              I want to login
            </Link> */}
          </form>
        </div>
      </div>
    </div>
  );
}
