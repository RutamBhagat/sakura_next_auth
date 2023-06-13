import NextAuth from "next-auth";

declare module "next-auth" {
  type Session = {
    user: {
      id: string;
      name: string;
      email: string;
      createdAt?: Date;
      accessToken: string;
      image?: string;
    };
  };
}
