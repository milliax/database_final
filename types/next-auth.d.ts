//src/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";
import { JWT } from "next-auth/jwt";

import { Prisma } from "@/generated/prisma";

declare module "next-auth" {
    interface User extends UserModel {
        id: string;
        email: string;
        role: Role;
        name: string;
    }

    interface Session extends DefaultSession {
        user: User;
        // username: string,
        // role: string,
        // accessToken: string
    }

    interface JWT extends DefaultJWT {
        role: string,
        email: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
    }
}