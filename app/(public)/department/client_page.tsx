"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";
import { numberInLetter } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function DepartmentPage({
    departments,
    schedules,
    department_name,
    department_id,
}: {
    departments: {
        name: string,
        id: string
    }[]
    schedules: string[][]
    department_name: string
    department_id: string
}) {
    const pathname = usePathname()
    const selected_id = pathname.split("/").pop() || "";

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
                                selected_id === dep.id ? "bg-green-600 text-white" : "hover:bg-green-200")}>
                                {dep.name}
                            </li>
                        </Link>
                    ))}
                </ul>
            </motion.div>
            {/* 右側班表動畫 */}

            <motion.div
                key={selected_id}
                className="flex-1 p-8"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ duration: 1.2, type: "spring" }}
            >
                <h1 className="text-2xl font-bold mb-6">{department_name} 班表</h1>
                {/* 新增：本週日期列 */}
                
                <div className="grid grid-cols-8 gap-0 divide-y divide-gray-600">
                    <div /> 
                    {Array.from({ length: 7 }).map((_, colIdx) => {
                        const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
                        const today = new Date();
                        const startDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
                        const day = new Date(startDayOfWeek.getFullYear(), startDayOfWeek.getMonth(), startDayOfWeek.getDate() + colIdx);
                        return (
                            <div
                                key={colIdx}
                                className="flex flex-col items-center justify-center" // <-- 移除 border-r
                            >
                                <div className="w-36 border border-gray-400 bg-blue-200 py-1 flex flex-col items-center rounded-xl">
                                    <span className="font-semibold">{weekDays[colIdx]}</span>
                                    <span className="text-black text-sm">{day.getMonth() + 1}/{day.getDate()}</span>
                                </div>
                            </div>
                        );
                    })}

                    {/* 區隔線，去掉 my-1，讓線直接貼合上下框 */}
                    <div className="col-span-8 border-b-4 border-gray-600" />

                    {schedules.map((slot, index) => {
                        if (index % 7 === 0) {
                            // 左側時段欄位加框
                            let timeLabel = "";
                            if (index === 0) timeLabel = "7:00-11:00";
                            if (index === 7) timeLabel = "13:00-17:00";
                            if (index === 14) timeLabel = "18:00-22:00";
                            return (
                                <React.Fragment key={index}>
                                    <div>
                                        <div className="w-36 border border-gray-400 bg-blue-100 py-8 flex flex-col items-center justify-center rounded-xl font-semibold border-b-4 border-gray-600">
                                            {timeLabel}
                                        </div>
                                    </div>
                                    <div className="text-center font-semibold flex flex-col gap-1 border-b-4 border-gray-600 bg-WHITE border-l border-gray-400 border-r border-gray-400">
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
                            <div key={index} className="text-center font-semibold flex flex-col gap-1 border-b-4 border-gray-600 bg-WHITE border-r border-gray-400">
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