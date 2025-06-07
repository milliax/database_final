import { prisma } from "@/lib/prisma";

import ClientPage from "../client_page";

export default async function DoctorSummaryPage({
    params
}: {
    params: Promise<{
        department: string
    }>
}
) {
    const department = (await params).department;

    console.log("Department:", department);

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
        }
    })

    console.log("Doctors:", doctors);
    // console.log(doctors)

    const departmentNames = new Set(doctors.map(d => ({
        // d.department?.name ?? "",
        name: d.department?.name ?? "",
        id: d.department?.id ?? ""
    })));

    let doctorsByDepartment: { [key: string]: any[] } = {};

    doctors.forEach((doctor) => {
        const departmentName = doctor.department?.name || "未分類";
        if (!doctorsByDepartment[departmentName]) {
            doctorsByDepartment[departmentName] = [];
        }
        doctorsByDepartment[departmentName].push(doctor);
    });

    const doctorInThisDepartment = doctors.filter((d) => encodeURI(d.department?.name ?? "") === department);

    return (
        <ClientPage
            departments={Array.from(departmentNames).filter(d => d.name !== "")}
            doctors={doctorInThisDepartment}
            department_name={decodeURI(department)}
        />
    );
}


