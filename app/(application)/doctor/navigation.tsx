"use client"

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import Link from 'next/link';

export default function DoctorNavigation() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/doctor/schedule" className="text-slate-900 hover:text-slate-600 px-4 py-2">
                            本週班表
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/doctor/clinic" className="text-slate-900 hover:text-slate-600 px-4 py-2">
                            門診進度
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}