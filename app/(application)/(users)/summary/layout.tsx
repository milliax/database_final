import React from "react";

import Navigation from "@/components/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

import { redirect } from "next/navigation";

export default async function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'PATIENT') {
        redirect('/'); // Redirect to unauthorized page if not admin
    }
    return (
        <React.Fragment>
            <Navigation />
            {children}
        </React.Fragment>
    );
}