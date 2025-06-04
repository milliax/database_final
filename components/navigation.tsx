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

    useEffect(() => {
        if (status === "authenticated") {
            setUser(session.user);
        } else {
            setUser(null);
        }
    }, [session, status]);

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
                    <Link href="/doctors"
                        className="text-slate-900 hover:text-slate-600 text-lg">
                        認識本院
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