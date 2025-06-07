import { prisma } from "@/lib/prisma";

import ClientPage from "../client_page"

export default async function DepartmentPage({
    params,
}: {
    params: Promise<{ department: string }>
}) {
    const p = await params;
    const department = decodeURI(p.department);

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
                    id: true,
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


    const doctorInThisDepartment = doctors.filter((d) => d.department?.name === department);

    let schedules: string[][] = [];

    for (let i = 0; i < 21; i++) {
        schedules.push([])
    }

    for (const doctor of doctorInThisDepartment) {
        const slots = doctor.schedules[0]?.slots || [];

        slots.forEach((slot, index) => {
            if (slot) {
                schedules[index].push(doctor.user?.name ?? "");
            }
        })
    }

    return (
        <ClientPage
            departments={Array.from(all_departments).filter(d => d.name !== "")}
            schedules={schedules}
            department_name={department}
        />
    );
}