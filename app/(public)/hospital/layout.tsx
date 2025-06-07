import React from 'react';

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <React.Fragment>
            {children}
            
        </React.Fragment>
    );
}