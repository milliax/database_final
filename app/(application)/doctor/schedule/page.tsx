"use client";
import { Session } from "inspector/promises";
import React, { useEffect, useState } from "react";

// 假設你有取得登入醫生的 id
// 實際專案請用 session 或 context 取得 doctorId
const doctorId = "CURRENT_DOCTOR_ID";

const timeSlots = ["上午", "下午", "晚上"];
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

type ScheduleCell = {
    hasSchedule: boolean;
    scheduleInfo?: string; // 你可以放更多資訊
};

export default function DoctorSchedulePage() {
    const [schedule, setSchedule] = useState<ScheduleCell[][]>(
        Array(3).fill(null).map(() => Array(7).fill({ hasSchedule: false }))
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 取得本週起始日（週日）
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        fetch(`/api/doctor/schedule?doctorId=${doctorId}&weekStart=${weekStart.toISOString()}`)
            .then(res => res.json())
            .then(data => {
                // data: [{ day: 0~6, slot: 0~2, info: string }]
                const newSchedule = Array(3).fill(null).map(() => Array(7).fill({ hasSchedule: false }));
                data.forEach((item: { day: number; slot: number; info?: string }) => {
                    newSchedule[item.slot][item.day] = { hasSchedule: true, scheduleInfo: item.info };
                });
                setSchedule(newSchedule);
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center">本週時段表</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 bg-white">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 bg-gray-100"></th>
                            {weekDays.map((day, idx) => (
                                <th key={idx} className="border px-4 py-2 bg-gray-100">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((slot, slotIdx) => (
                            <tr key={slotIdx}>
                                <td className="border px-4 py-2 font-semibold bg-gray-100">{slot}</td>
                                {schedule[slotIdx].map((cell, dayIdx) => (
                                    <td key={dayIdx} className="border px-4 py-2 text-center">
                                        {loading ? (
                                            <span className="text-gray-400">載入中</span>
                                        ) : cell.hasSchedule ? (
                                            <span className="text-green-600 font-bold">✔</span>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}