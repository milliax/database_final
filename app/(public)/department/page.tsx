"use client";
import { useState } from "react";
import { motion } from "framer-motion";

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

export default function DepartmentPage() {
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
                        <li key={dep.id}>
                            <button
                                className={`w-full text-left px-3 py-2 rounded mb-2 ${selected === dep.id ? "bg-green-600 text-white" : "hover:bg-green-200"}`}
                                onClick={() => setSelected(dep.id)}
                            >
                                {dep.name}
                            </button>
                        </li>
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
                <h1 className="text-2xl font-bold mb-6">{departments.find(d => d.id === selected)?.name} 班表</h1>
                <div className="overflow-x-auto">
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
                                            {schedules[selected][rowIdx]?.[colIdx] || ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
