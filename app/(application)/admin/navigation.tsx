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
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="cursor-pointer">醫生管理</NavigationMenuTrigger>

                    <NavigationMenuContent>
                        <ul className="grid w-[10rem] gap-2 place-items-center">
                            <Link href="/admin/doctor/detail" className="text-slate-900 hover:text-slate-600 text-center w-32">
                                {/* <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center"> */}
                                醫生資料
                                {/* </NavigationMenuLink> */}
                            </Link>
                            <Link href="/admin/doctor/rearrange" className="text-slate-900 hover:text-slate-600 text-center w-32">
                                {/* <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center"> */}
                                代班
                                {/* </NavigationMenuLink> */}
                            </Link>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className="cursor-pointer">病患管理</NavigationMenuTrigger>

                    <NavigationMenuContent>
                        <ul className="grid w-[10rem] gap-2 place-items-center">
                            <Link href="/admin/patient/history" className="text-slate-900 hover:text-slate-600">
                                {/* <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center"> */}
                                病歷管理
                                {/* </NavigationMenuLink> */}
                            </Link>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className="cursor-pointer">報表</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[10rem] gap-2 place-items-center">
                            <Link href="/admin/report/chart" className="text-slate-900 hover:text-slate-600">
                                {/* <NavigationMenuLink className="text-slate-900 hover:text-slate-600 w-32 text-center"> */}
                                季度報告
                                {/* </NavigationMenuLink> */}
                            </Link>
                        </ul>
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