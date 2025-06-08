import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import ToastProvider from "@/app/toastProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "邱綜合醫院 | 醫療資訊系統",
    description: "邱綜合醫院醫療資訊系統，提供醫療相關資訊與服務，包括病歷查詢、預約掛號、檢驗報告等功能。 系統旨在提升醫療服務效率，改善病患就醫體驗。",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-TW">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-natrual-50`}
            >

                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}
