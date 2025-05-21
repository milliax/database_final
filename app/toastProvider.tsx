"use client"

import Script from "next/script"
import React from "react"
import { ToastContainer } from "react-toastify"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ToastProvider({
    children
}: {
    children: React.ReactNode
}) {
    useClarityPageView();

    return (
        <React.Fragment>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Script id="ms-clarity" strategy="afterInteractive">
                {`
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY}");
                    `}
            </Script>
        </React.Fragment>
    )
}

const useClarityPageView = () => {
    // const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== "undefined" && window.clarity) {
            window.clarity("set", "pageview", pathname); // Trigger a new Clarity pageview
        }
    }, [pathname]);

    useEffect(() => {
        window.addEventListener('load', () => {
            if (typeof window !== "undefined" && window.clarity) {
                window.clarity("start");
            }
        });
    }, []);
}