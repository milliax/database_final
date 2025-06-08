"use client";
import { useEffect, useState } from "react";

const shiftLabel = [
    { label: "早班 7:00-11:00", idx: 0 },
    { label: "午班 13:00-17:00", idx: 1 },
    { label: "晚班 18:00-22:00", idx: 2 },
];

export default function DoctorSummaryPage() {
    const [slots, setSlots] = useState<any[][]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            const res = await fetch("/api/doctor/schedule");
            const data = await res.json();
            setSlots(data.schedule || []);
            setLoading(false);
        };
        fetchSchedules();
    }, []);

    const today = new Date();
    const dateStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    const dayIdx = today.getDay(); // 0:週日, 1:週一, ..., 6:週六

    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center">今日班表</h1>
            <div className="mb-4 text-center text-gray-600">{dateStr}</div>
            {loading ? (
                <div className="text-center text-gray-400">載入中...</div>
            ) : (
                <ul className="space-y-4">
                    {shiftLabel.map(({ label, idx }) => (
                        <li key={idx} className="bg-white rounded shadow p-4 flex flex-col items-center">
                            <div className="font-semibold text-lg mb-1">{label}</div>
                            <div className="text-gray-500">
                                {slots[idx] && slots[idx][dayIdx]
                                    ? "有排班"
                                    : "未排班"}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}