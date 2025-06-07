"use client"

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

// get session nextjs

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Navigation() {

    const { data: session, status } = useSession();
    const [user, setUser] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (status === "authenticated") {
            setUser(session.user);
        } else {
            setUser(null);
        }
    }, [session, status]);

    const handleMouseEnter = () => {
        if (timer) clearTimeout(timer);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        const t = setTimeout(() => setOpen(false), 150); // 150ms 延遲
        setTimer(t);
    };

    return (
        <nav className="w-full flex flex-row h-16 bg-slate-50 justify-between gap-5 items-center pr-5">
            <div className="flex flex-row items-center gap-5">
                <Link href="/" className="text-slate-900 hover:text-slate-600">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="object-cover w-20 h-20 rounded-full"
                    />
                </Link>
                <div className="flex flex-row gap-3">
                    <div
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="text-slate-900 hover:text-slate-600 text-lg">
                            我要預約
                        </button>
                        {open && (
                            <div className="absolute left-0 mt-2 w-32 bg-white border rounded shadow z-10">
                                <Link
                                    href="/department"
                                    className="block px-4 py-2 text-slate-900 hover:bg-slate-100"
                                >
                                    預約
                                </Link>
                                <Link
                                    href="/reservation/history"
                                    className="block px-4 py-2 text-slate-900 hover:bg-slate-100"
                                >
                                    預約紀錄
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link href="/hospital"
                        className="text-slate-900 hover:text-slate-600 text-lg">
                        認識本院
                    </Link>
                    <Link href="/doctors"
                        className="text-slate-900 hover:text-slate-600 text-lg">
                        門診時間
                    </Link>
                </div>
            </div>
            <div className="flex flex-row gap-5">
                {user ? (
                    <>
                        {/* <Link href="/profile" className="text-slate-900 hover:text-slate-600">
                            {user.name || user.email}
                        </Link> */}
                        <button
                            onClick={() => signOut()}
                            className="text-slate-900 hover:text-slate-600 cursor-pointer"
                        >
                            登出
                        </button>
                    </>
                ) : (
                    <Link href="/login" className="text-slate-900 hover:text-slate-600">
                        登入
                    </Link>
                )}
                {/* <Link href="/login" className="text-slate-900 hover:text-slate-600">
                    登入
                </Link> */}
            </div>
        </nav>
    );
}