import React from 'react';

import Navigation from '@/components/navigation';

export default function BeforeLoggedInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <React.Fragment>
            <Navigation />
            {/* This is the main content area */}
            {/* You can add a header or footer here if needed */}
            {/* The children prop will render the content of the current route */}
            {/* You can also add a sidebar or other layout elements here */}
            {children}
        </React.Fragment>
    );
}