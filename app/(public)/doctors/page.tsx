

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
                }
            }
        }
    })

    // console.log(doctors)

    const departmentNames = new Set(doctors.map(d => d.department?.name ?? ""));
    let doctorsByDepartment: { [key: string]: any[] } = {};

    doctors.forEach((doctor) => {
        const departmentName = doctor.department?.name || "未分類";
        if (!doctorsByDepartment[departmentName]) {
            doctorsByDepartment[departmentName] = [];
        }
        doctorsByDepartment[departmentName].push(doctor);
    });

    console.log(doctorsByDepartment);

    return (
        <ClientPage departments={Array.from(departmentNames).filter(d => d !== "")}
            doctors={doctors}
            department_name="全部"
        />
    );
}


