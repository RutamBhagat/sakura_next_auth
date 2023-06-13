"use client";
import React, { useState } from "react";
import SignInButton from "./SignInButton";
import Link from "next/link";
import SessionButton from "./SessionButton";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [state, setState] = useState(false);

  const navigation = [
    { title: "Notifications", path: "/" },
    { title: "Photos", path: "/photos" },
    { title: "Text", path: "/text" },
    { title: "Calculator", path: "/calculator" },
  ];

  return (
    <nav
      className={`bg-white md:text-sm ${
        state ? "shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0" : ""
      }`}
    >
      <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-2.5 md:block">
          <Link href="/" className="flex gap-3 justify-center items-center font-semibold text-2xl uppercase">
            <img
              className="rounded-full"
              src={
                session?.user.image
                  ? session?.user.image
                  : "https://media.licdn.com/dms/image/C4D0BAQHGSg1Bni4TYw/company-logo_200_200/0/1616853744387?e=1694649600&v=beta&t=O5mA-lkrgTArr6Dgeh7ThaaPSwZm76cLJ86i3iUKNW8"
              }
              width={50}
              height={50}
            />
            Nordstone
          </Link>
          <div className="md:hidden">
            <button className="menu-btn text-gray-500 hover:text-gray-800" onClick={() => setState(!state)}>
              {state ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${state ? "block" : "hidden"} `}>
          <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {navigation.map((item, idx) => {
              return (
                <li key={idx} className="text-gray-700 hover:text-gray-900">
                  <Link href={item.path} className="block">
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
            <Link href="/auth/register" className="block text-gray-700 hover:text-gray-900">
              Register
            </Link>
            <SignInButton />
            {/* <SessionButton /> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
