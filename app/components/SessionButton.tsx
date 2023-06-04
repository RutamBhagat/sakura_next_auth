"use client";
import { signJwtAccessToken } from "@/lib/jwt";
import axios from "axios";
import { useSession } from "next-auth/react";
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
      <li>
        <button
          onClick={updateSession}
          className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline"
        >
          Update Session
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            console.log("{session}", { session });
          }}
          className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline"
        >
          Log Session
        </button>
      </li>
    </>
  );
}
