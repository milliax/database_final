"use client"

import { signOut } from "next-auth/react";

export default function LogoutButtonForDoctor() {

    return (
        <button
            onClick={() => signOut()}
            className="text-slate-900 hover:text-slate-600 cursor-pointer"
        >
            登出
        </button>
    );
}