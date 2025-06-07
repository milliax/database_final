"use client"

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function DoctorSummaryPage({
    doctors,
    departments,
    department_name,
    department_id,
}: {
    departments: {
        name: string,
        id: string
    }[]
    doctors: any[]
    department_name: string
    department_id: string
}) {
    const pathname = usePathname()
    const selected_department = pathname.split("/").pop() || "";

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
        <section className="flex min-h-screen">
            {/* <ul className="w-40 text-center text-2xl mb-6 flex flex-col gap-2">
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
            </ul> */}
            <motion.div
                className="w-48 bg-gray-100 p-6"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, type: "spring" }}
            >
                <h2 className="font-bold mb-4">科別</h2>
                <ul>
                    <Link href={`/doctors`} passHref>
                        <li className={clsx("w-full text-left px-3 py-2 rounded mb-2",
                            selected_department === "doctors" ? "bg-green-600 text-white" : "hover:bg-green-200")}>
                            全部科別
                        </li>
                    </Link>
                    {departments.map(dep => (
                        <Link href={`/doctors/${dep.id}`} passHref key={dep.id}>
                            <li className={clsx("w-full text-left px-3 py-2 rounded mb-2",
                                selected_department === dep.id ? "bg-green-600 text-white" : "hover:bg-green-200")}>
                                {dep.name}
                            </li>
                        </Link>
                    ))}
                </ul>
            </motion.div>

            <motion.div
                key={selected_department}
                className="flex-1 p-8"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ duration: 1.2, type: "spring" }}
            >
                <h1 className="text-2xl font-bold mb-6">{department_name}</h1>
                <div className="overflow-x-auto">
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
                                        {/* TODO: datetime error hydration */}
                                        <div className="mt-2 text-sm text-gray-500">資料更新日期: {new Date(d.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>
        </section>
    );
}


