

import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
    return (
        <nav className="w-full flex flex-row h-18 bg-slate-50 justify-between gap-5 items-center pr-5">
            <div>
                <Link href="/" className="text-slate-900 hover:text-slate-600">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="object-cover w-20 h-20 rounded-full"
                    />
                </Link>
            </div>
            <div className="flex flex-row gap-5">
                <Link href="/login" className="text-slate-900 hover:text-slate-600">
                    登入
                </Link>
            </div>
        </nav>
    );
}