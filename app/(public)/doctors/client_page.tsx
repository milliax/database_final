"use client"

import Image from "next/image";
import Link from "next/link";

export default function DoctorSummaryPage({
    doctors,
    departments,
    department_name,
}: {
    departments: string[]
    doctors: any[]
    department_name: string
}) {
    // console.log(doctors)

    // const departmentNames = new Set(doctors.map(d => d.department?.name ?? ""));
    // let doctorsByDepartment: { [key: string]: any[] } = {};

    // doctors.forEach((doctor) => {
    //     const departmentName = doctor.department?.name || "未分類";
    //     if (!doctorsByDepartment[departmentName]) {
    //         doctorsByDepartment[departmentName] = [];
    //     }
    //     doctorsByDepartment[departmentName].push(doctor);
    // });

    // const doctorInThisDepartment = doctors.filter((d) => encodeURI(d.department?.name ?? "") === department);

    return (
        <section className="w-full flex flex-row p-5 max-w-6xl mx-auto">
            <ul className="w-40 text-center text-2xl mb-6 flex flex-col gap-2">
                <Link href={`/doctors`} passHref>
                    <li className="block text-green-700 hover:text-green-900 bg-white rounded-md w-full border ">
                        全部醫師
                    </li>
                </Link>
                {departments.map((name) => (
                    <Link key={name} href={`/doctors/${name}`} passHref>
                        <li className="block text-green-700 hover:text-green-900 bg-white rounded-md w-full border ">
                            {name}
                        </li>
                    </Link>
                ))}
            </ul>
            <div className="w-3/5 mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-center text-green-700 mb-6">{department_name}</h1>
                {doctors.map((d) => {
                    // console.log(d.doctor.bio)
                    const b = d.bio || "";

                    const blocks = b.split("\n").filter((block: any) => block.trim() !== "");

                    return (
                        <div key={d.id} className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-40 h-40 relative rounded-full overflow-hidden border border-gray-300">
                                    <Image src={d.user.image || "/images/default-doctor.jpg"} alt={d.user.name ?? "anonnymous"} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold text-green-800">主治醫師：{d.user.name}</h2>
                                    {blocks.map((block: any, index: number) => {
                                        if (block.startsWith("(") && block.endsWith(")")) {
                                            return (
                                                <h3 key={index} className="mt-2 text-black text-2xl">
                                                    {block.slice(1, -1)}
                                                </h3>
                                            );
                                        }
                                        return (
                                            <p key={index} className="mt-2 text-gray-700 text-lg">
                                                {block}
                                            </p>
                                        );
                                    })}
                                    <div className="mt-4 flex justify-end">
                                        <Link
                                            href={`/doctor/${d.id}`}
                                            className="text-xl px-6 py-2 rounded-full bg-yellow-400 text-black hover:bg-green-800 hover:text-white transition hover:scale-110 duration-75"
                                        >
                                            我要預約
                                        </Link>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">資料更新日期: {new Date(d.updatedAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    );
}


