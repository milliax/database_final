// import { getProviders } from "next-auth/react"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/auth"

import Client from "./page_client"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

import { redirect } from "next/navigation"

export default async function LoginPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string }>
}) {
    const session = await getServerSession(authOptions);

    const params = await searchParams;

    if (params?.redirect) {
        if (session) {
            if (params.redirect.startsWith("/")) {
                redirect(`${params.redirect}`); // already logged in, redirect to home
            }
        }
    }

    if (session) {
        // logged in

        // console.log(session)
        if (session.user) {
            // @ts-ignore
            const role = session.user.role as string
            console.log("User role:", role)

            switch (role) {
                case "ADMIN":
                    redirect("/admin")
                    break;
                // case "PATIENT":
                //     redirect("/")
                //     break;
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