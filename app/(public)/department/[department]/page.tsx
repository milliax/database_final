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

    let department_mapping: {
        [key: string]: string
    } = {}

    const departmentNames = new Set(doctors.map(d => {
        if (d.department && d.department.id) {
            department_mapping[d.department.id] = d.department.name;
        }
        return d.department?.name ?? ""
    }));


    const doctorInThisDepartment = doctors.filter((d) => d.department?.id === department);

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

    const departments = Array.from(departmentNames)
        .filter(name => name !== "")
        .map(name => ({
            name,
            id: Object.keys(department_mapping).find(key => department_mapping[key] === name) || ""
        }));

    const department_name = await prisma.department.findUnique({
        where: {
            id: department
        },
        select: {
            name: true
        }
    });

    return (
        <ClientPage
            departments={departments}
            schedules={schedules}
            department_name={department_name?.name || "未知科別"}
        />
    );
}