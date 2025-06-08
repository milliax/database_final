import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";

export default function SignedInUserLayout({ children }: { children?: React.ReactNode }) {
    const session = getServerSession(authOptions);

    if (!session) {
        // If the user is not signed in, you can redirect them or show an error
        // For example, you could throw an error or redirect to a sign-in page
        redirect('/');
    }

    return (
        <React.Fragment>
            <Navigation />
            {children}
        </React.Fragment>
    )
}