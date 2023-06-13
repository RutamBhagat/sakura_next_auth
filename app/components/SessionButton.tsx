"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

type Props = {};

export default function SessionButton({}: Props) {
  const { data: session, update } = useSession();
  const updateSession = async () => {
    if (!session) return;
    // @ts-ignore
    let { accessToken, iat, jat, exp, ...userWithoutToken } = session?.user;
    const response = await axios.post("/api/generateToken", { userWithoutToken: userWithoutToken });
    accessToken = response.data;
    await update({ ...session, user: { ...session?.user, accessToken: accessToken } });
  };

  return (
    <>
      <Link
        href="javascript:void(0)"
        onClick={updateSession}
        className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
      >
        Update Session
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
      <Link
        href="javascript:void(0)"
        onClick={() => {
          console.log("{session}", { session });
        }}
        className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
      >
        Log Session
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </>
  );
}
