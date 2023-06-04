"use client";
import { signIn, signOut, useSession } from "next-auth/react";

type Props = {};

export default function SignInButton({}: Props) {
  // NOTE: Here session is not a type but we are just renaming data to session
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <button
        onClick={() => {
          signOut();
        }}
        className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline"
      >
        {session.user.name} Sign Out
      </button>
    );
  }
  return (
    <button
      onClick={() => {
        signIn();
      }}
      className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline"
    >
      Log In
    </button>
  );
}
