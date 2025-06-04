import React from "react";

import Navigation from "@/components/navigation";

export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <React.Fragment>
            <Navigation />
            {children}
        </React.Fragment>
    );
}