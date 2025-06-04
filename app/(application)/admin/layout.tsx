import React from 'react';
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuViewport,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

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
        
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">未授權存取</h1>
            </div>
        );
    }

    return (
        <React.Fragment>
            <nav className='flex flex-row bg-slate-100 w-full h-16 items-center justify-between px-5'>
                <div className='flex flex-row items-center gap-5'>
                    <Link href="/" className="text-slate-900 hover:text-slate-600">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="object-cover w-20 h-20 rounded-full"
                        />
                    </Link>

                    <NavigationMenu className='w-full'>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>醫生管理</NavigationMenuTrigger>

                                <NavigationMenuContent>
                                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">

                                        <Link href="/admin/doctor/detail" className="text-slate-900 hover:text-slate-600">
                                            <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center">
                                                醫生資料
                                            </NavigationMenuLink>
                                        </Link>
                                        <Link href="/admin/doctor/schedule" className="text-slate-900 hover:text-slate-600">
                                            <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center">
                                                班表排程
                                            </NavigationMenuLink>
                                        </Link>
                                        <Link href="/admin/doctor/rearrange" className="text-slate-900 hover:text-slate-600">
                                            <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center">
                                                代班
                                            </NavigationMenuLink>
                                        </Link>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>病患管理</NavigationMenuTrigger>

                                <NavigationMenuContent>
                                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <Link href="/admin/patient/history" className="text-slate-900 hover:text-slate-600">
                                            <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center">
                                                病歷管理
                                            </NavigationMenuLink>
                                        </Link>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>報表</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <Link href="/admin/report/chart" className="text-slate-900 hover:text-slate-600">
                                        <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center">
                                            季度報告
                                        </NavigationMenuLink>
                                    </Link>
                                    {/* <NavigationMenuLink></NavigationMenuLink> */}
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuLink asChild>
                                <Link href="#">
                                    <div className="font-medium">通知</div>
                                    {/* <div className="text-muted-foreground">
                                    Learn how to use the library.
                                    </div> */}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuList>
                    </NavigationMenu>
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