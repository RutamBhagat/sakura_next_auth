"use client";
import Link from "next/link";
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import ZoomingBackground from "../components/page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const defaultFormFields = {
  email: "",
  password: "",
};

export default function page() {
  const router = useRouter();
  const [input, setInput] = useState(defaultFormFields);
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (input.email && input.password) {
      return setIsDisabled(false);
    }
    setIsDisabled(true);
  }, [input]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setInput({ ...input, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      }).then((res) => {
        console.log("res", res);
        // @ts-ignore
        if (res.error) {
          // @ts-ignore
          // this error shows "CredentialsSignIn" which is a helpful error hence show custom error
          console.log(res.error);
          // @ts-ignore
          setError("Invalid email or password");
        } else {
          router.push("/");
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-5">
      <div className="flex h-full flex-col items-center justify-center px-4 sm:px-0">
        <div className="flex h-[675px] w-full rounded-2xl bg-gray-300 shadow-lg sm:mx-0 sm:w-3/4 md:w-5/6 lg:max-w-5xl">
          <div className="relative flex w-full flex-col justify-center px-10 md:w-1/2 md:px-4 lg:px-10">
            {error && (
              <div className="absolute top-2 left-2 right-2 flex p-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                <svg
                  aria-hidden="true"
                  className="flex-shrink-0 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div className="ml-3 text-sm font-medium">{error}</div>
                <button
                  onClick={() => {
                    setError(null);
                  }}
                  type="button"
                  className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
            <h1 className="text-4xl font-medium">Login</h1>
            <p className="text-slate-500">Hi, Welcome back</p>
            <form onSubmit={handleSubmit} className="mt-10 mb-5">
              <div className="flex flex-col space-y-5">
                <label>
                  <p className="pb-2 font-medium text-slate-700">Email address</p>
                  <input
                    required
                    onChange={handleChange}
                    name="email"
                    type="email"
                    value={input.email}
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-slate-200 py-3 px-3 hover:shadow focus:border-slate-500 focus:outline-none"
                  />
                </label>
                <label>
                  <p className="pb-2 font-medium text-slate-700">Password</p>
                  <input
                    required
                    onChange={handleChange}
                    name="password"
                    type="password"
                    value={input.password}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-200 py-3 px-3 hover:shadow focus:border-slate-500 focus:outline-none"
                  />
                </label>
                <div className="flex justify-end">
                  <Link
                    href="/auth/check_email"
                    className="inline-flex items-center space-x-1 font-sm text-sm text-violet-800 hover:text-violet-900"
                  >
                    <span>Forgot Password</span>
                  </Link>
                </div>
                <button
                  disabled={isDisabled}
                  className={`${
                    isDisabled ? "bg-violet-500" : "bg-violet-800 hover:bg-violet-900"
                  } inline-flex w-full items-center justify-center space-x-2 rounded-lg border-violet-800 py-3 font-medium text-white hover:shadow`}
                >
                  <span>Sign In</span>
                </button>
                <p className="text-center">
                  Not registered yet?{" "}
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center space-x-1 font-medium text-violet-800 hover:text-violet-900"
                  >
                    <span>Register now </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
          <ZoomingBackground imageSrc="https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80" />
        </div>
      </div>
    </div>
  );
}
