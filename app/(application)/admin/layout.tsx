import React from 'react';
import Link from 'next/link';

import Navigation from './navigation';

import Image from 'next/image';
import LogoutButton from './logout_button';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/'); // Redirect to unauthorized page if not admin
    }

    return (
        <React.Fragment>
            <nav className='flex flex-row bg-slate-100 w-full h-16 items-center justify-between px-5'>
                <div className='flex flex-row items-center gap-5'>
                    <Link href="/admin" className="text-slate-900 hover:text-slate-600">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="object-cover w-20 h-20 rounded-full"
                        />
                    </Link>

                    <Navigation />
                </div>
                <div className="flex flex-row gap-5">
                    <LogoutButton />
                </div>
            </nav>
            {/* <nav className='w-full bg-slate-100 text-black p-4 h-12 gap-3 flex flex-row'>
                <Link href="/admin/schedule">班表排程</Link>
                <Link href="/admin/schedule">醫生資料</Link>
                <Link href="/admin/schedule">帳號管理</Link>
                
                <Link href="/admin/schedule">代班</Link>

                <Link href="/admin/schedule">病歷管理</Link>
                <Link href="/admin/reports">報表</Link>
                <Link href="/admin/notifications">通知</Link>
                <Link href="/admin/settings">設定</Link>
            </nav> */}
            {children}

        </React.Fragment>
    );
}