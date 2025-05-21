// import { getProviders } from "next-auth/react"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/auth"

import Client from "./page_client"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

import { redirect } from "next/navigation"

export default async function LoginPage() {

    const session = await getServerSession(authOptions);

    if (session) {
        // logged in

        // console.log(session)
        if (session.user) {
            // @ts-ignore
            const role = session.user.role as string

            switch (role) {
                case "ADMIN":
                    redirect("/admin")
                    break;
                case "PATIENT":
                    redirect("/summary")
                    break;
                case "DOCTOR":
                    redirect("/doctor")
                    break;
                default:
                    redirect("/")
                    break;
            }
        }
    }
    return (
        <Client />
    )
}