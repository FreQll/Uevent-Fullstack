"use client";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4 text-green-600">
        Payment Success
      </h1>
      <p className="text-lg text-gray-700">
        Payment was successful. Thank you!
      </p>
    </div>
  );
}
