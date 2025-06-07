

import { prisma } from "@/lib/prisma";

import ClientPage from "./client_page";

export default async function DoctorSummaryPage() {
    const doctors = await prisma.doctor.findMany({
        select: {
            id: true,
            bio: true,
            updatedAt: true,
            user: {
                select: {
                    name: true,
                    image: true,
                }
            },
            department: {
                select: {
                    name: true,
                    id: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    // console.log(doctors)
    let department_mapping: {
        [key: string]: string
    } = {}

    const departmentNames = new Set(doctors.map(d => {
        if (d.department && d.department.id) {
            department_mapping[d.department.id] = d.department.name;
        }
        return d.department?.name ?? ""
    }));

    let doctorsByDepartment: { [key: string]: any[] } = {};

    doctors.forEach((doctor) => {
        const departmentName = doctor.department?.name || "未分類";
        if (!doctorsByDepartment[departmentName]) {
            doctorsByDepartment[departmentName] = [];
        }
        doctorsByDepartment[departmentName].push(doctor);
    });

    console.log(doctorsByDepartment);

    const departments = Array.from(departmentNames)
        .filter(name => name !== "")
        .map(name => ({
            name,
            id: Object.keys(department_mapping).find(key => department_mapping[key] === name) || ""
        }));

    return (
        <ClientPage
            departments={departments}
            doctors={doctors}
            department_name="全部"
        />
    );
}


