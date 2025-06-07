import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import ClientPage from "./client_page"

export default async function DepartmentPage() {

    const doctors = await prisma.doctor.findMany({
        select: {
            user: {
                select: {
                    name: true,
                }
            },
            department: {
                select: {
                    name: true,
                    id: true
                }
            },
            schedules: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    slots: true
                }
            }
        }
    })

    const all_departments = new Set(doctors.map(d => ({
        // d.department?.name ?? "",
        name: d.department?.name ?? "",
        id: d.department?.id ?? ""
    })));

    console.log("All Departments:", Array.from(all_departments));

    redirect(`/department/${Array.from(all_departments).filter(d => d.name !== "")[0]}`);
}