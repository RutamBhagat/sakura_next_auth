import NextAuth from "next-auth";

declare module "next-auth" {
  type Session = {
    user: {
      id: number;
      name: string;
      email: string;
      createdAt?: Date;
      accessToken: string;
    };
  };
}
