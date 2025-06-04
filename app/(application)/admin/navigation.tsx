"use client"

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

import Link from 'next/link';

export default function AdminNavigation() {
    return (
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
    )
}