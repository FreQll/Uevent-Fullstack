"use client";
import route from "@/api/route";
import axios from "../../helper/axios";
import { use, useEffect, useState } from "react";
import { useMyUser } from "@/store/users";
import SignInForm from "@/components/Auth/SignInForm";
import Link from "next/link";

export default function Login({ params }: { params: { id: string } }) {


  return (
    <div className="w-[100vw] h-[100vh]">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between pr-[10%] lg:pr-[20%] h-[100%]">
        <div className="w-[50%] h-[100%]">
          <div className=" absolute top-0 left-0 w-[40%] h-[100%] bg-center bg-cover bg-[url('https://i.pinimg.com/originals/14/19/d4/1419d4bd43cc6587dc6a0dce1ccf1da9.jpg')]">
          </div>
        </div>
        
        <div className="min-w-[400px] flex flex-col items-center justify-center gap-[20px] text-center">
          <div className="flex flex-col gap-2">
            <h1 className="uppercase text-[var(--dark-blue)] font-[600] text-[24px]">
              Sign In
            </h1>
            <div className="text-[14px] opacity-60">
              Use your email to log in to account
            </div>
              <Link href={'/register'}
                  className='text-[14px] text-[var(--dark-blue)] bg-transparent'
              >Not registered yet?</Link>
          </div>

          <SignInForm />

          {/* <div className="flex gap-[15px] justify-between w-[100%] items-center">
            <div className="w-[-webkit-fill-available] h-[1px] bg-black opacity-20"></div>
            <span className="opacity-60">or</span>
            <div className="w-[-webkit-fill-available] h-[1px] bg-black opacity-20"></div>
          </div> */}

          <Link
            href={"/login/reset"}
            className="text-[14px] text-[var(--dark-blue)] bg-transparent"
          >
            I forgot my password
          </Link>

          <div className="w-[100%]">
            {/* <GoogleButton /> */}
          </div>
        </div>
      </div>
    </div>
  );
}