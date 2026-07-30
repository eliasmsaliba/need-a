import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "provider";
    } & DefaultSession["user"];
  }

  interface User {
    role: "customer" | "provider";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "customer" | "provider";
  }
}
