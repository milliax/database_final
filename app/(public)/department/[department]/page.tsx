
const departments = [
    { id: "internal", name: "內科" },
    { id: "surgery", name: "外科" },
    { id: "pediatrics", name: "小兒科" },
];

const days = ["一", "二", "三", "四", "五", "六", "日"];
const times = ["7:00-11:00", "13:00-17:00", "18:00-22:00"];

const schedules: Record<string, string[][]> = {
    internal: [
        ["王醫師", "王醫師", "李醫師", "李醫師", "王醫師", "", ""],
        ["李醫師", "王醫師", "王醫師", "李醫師", "王醫師", "", ""],
        ["", "李醫師", "王醫師", "王醫師", "李醫師", "", ""],
        ["", "", "", "", "", "", ""],
    ],
    surgery: [
        ["陳醫師", "陳醫師", "陳醫師", "陳醫師", "陳醫師", "", ""],
        ["", "陳醫師", "陳醫師", "陳醫師", "陳醫師", "", ""],
        ["", "", "陳醫師", "陳醫師", "陳醫師", "", ""],
        ["", "", "", "", "", "", ""],
    ],
    pediatrics: [
        ["張醫師", "張醫師", "張醫師", "張醫師", "張醫師", "", ""],
        ["", "張醫師", "張醫師", "張醫師", "張醫師", "", ""],
        ["", "", "張醫師", "張醫師", "張醫師", "", ""],
        ["", "", "", "", "", "", ""],
    ],
};

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

    const all_departments: Set<string> = new Set()

    doctors.forEach(doctor => {
        all_departments.add(doctor.department?.name ?? "")
    })


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
            departments={Array.from(all_departments).filter(d => d !== "")}
            schedules={schedules}
            department_name={department}
        />
    );
}