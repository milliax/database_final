"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";
import { numberInLetter } from "@/lib/utils";

// const schedules: Record<string, string[][]> = {
// internal: [
//     ["王醫師", "王醫師", "李醫師", "李醫師", "王醫師", "", ""],
//     ["李醫師", "王醫師", "王醫師", "李醫師", "王醫師", "", ""],
//     ["", "李醫師", "王醫師", "王醫師", "李醫師", "", ""],
//     ["", "", "", "", "", "", ""],
// ],
//     surgery: [
//         ["陳醫師", "陳醫師", "陳醫師", "陳醫師", "陳醫師", "", ""],
//         ["", "陳醫師", "陳醫師", "陳醫師", "陳醫師", "", ""],
//         ["", "", "陳醫師", "陳醫師", "陳醫師", "", ""],
//         ["", "", "", "", "", "", ""],
//     ],
//     pediatrics: [
//         ["張醫師", "張醫師", "張醫師", "張醫師", "張醫師", "", ""],
//         ["", "張醫師", "張醫師", "張醫師", "張醫師", "", ""],
//         ["", "", "張醫師", "張醫師", "張醫師", "", ""],
//         ["", "", "", "", "", "", ""],
//     ],
// };

export default function DepartmentPage({
    departments,
    schedules,
    department_name,
}: {
    departments: {
        name: string,
        id: string
    }[]
    schedules: string[][]
    department_name: string
}) {
    const [selected, setSelected] = useState("internal");

    return (
        <div className="flex min-h-screen">
            {/* 左側選單動畫 */}
            <motion.div
                className="w-48 bg-gray-100 p-6"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, type: "spring" }}
            >
                <h2 className="font-bold mb-4">科別</h2>
                <ul>
                    {departments.map(dep => (
                        <Link href={`/department/${dep.id}`} passHref key={dep.id}>
                            <li className={clsx("w-full text-left px-3 py-2 rounded mb-2",
                                selected === dep.id ? "bg-green-600 text-white" : "hover:bg-green-200")}>
                                {dep.name}
                            </li>
                        </Link>
                    ))}
                </ul>
            </motion.div>
            {/* 右側班表動畫 */}

            <motion.div
                key={selected}
                className="flex-1 p-8"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ duration: 1.2, type: "spring" }}
            >
                <h1 className="text-2xl font-bold mb-6">{department_name} 班表</h1>
                <div className="grid grid-cols-8 gap-5 divide-y divide-gray-600">
                    <div />
                    {Array.from({ length: 7 }).map((_, rowIdx) => (
                        <div key={rowIdx} className="text-center font-semibold">
                            {numberInLetter(rowIdx)}
                        </div>
                    ))}

                    {schedules.map((slot, index) => {
                        if (index % 7 === 0) {
                            return (
                                <React.Fragment key={index}>
                                    <div >
                                        {index === 0 && "7:00-11:00"}
                                        {index === 7 && "13:00-17:00"}
                                        {index === 14 && "18:00-22:00"}
                                    </div>
                                    <div key={index} className="text-center font-semibold flex flex-col gap-1">
                                        {slot.map((doctor, colIdx) => (
                                            <div key={doctor}>
                                                {doctor}
                                            </div>
                                        ))}
                                    </div>
                                </React.Fragment>
                            )
                        }

                        return (
                            <div key={index} className="text-center font-semibold flex flex-col gap-1">
                                {slot.map((doctor, colIdx) => (
                                    <div key={doctor}>
                                        {doctor}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
                {/* <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 bg-gray-50"></th>
                                {days.map(day => (
                                    <th key={day} className="border px-4 py-2 bg-gray-50">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {times.map((time, rowIdx) => (
                                <tr key={time}>
                                    <td className="border px-4 py-2 font-semibold bg-gray-50">{time}</td>
                                    {days.map((_, colIdx) => (
                                        <td key={colIdx} className="border px-4 py-2 text-center">
                                            {schedules[rowIdx]?.[colIdx] || ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}
            </motion.div>
        </div>
    );
}