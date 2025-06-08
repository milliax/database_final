"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
const timeSlots = ["7:00-11:00", "13:00-17:00", "18:00-22:00"];

type ScheduleCell = string | null;

export default function DoctorSchedulePage() {
    const params = useParams();
    const doctorId = params?.doctor_id as string;

    const [schedules, setSchedules] = useState<ScheduleCell[][]>(
        Array(3).fill(null).map(() => Array(7).fill(null))
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!doctorId) return;
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        fetch(`/api/doctor/schedule?doctorId=${doctorId}&weekStart=${weekStart.toISOString()}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.schedules) && data.schedules.length === 3) {
                    setSchedules(data.schedules);
                }
                setLoading(false);
            });
    }, [doctorId]);

    return (
        <div className="flex min-h-screen">
            <motion.div
                className="flex-1 p-8"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ duration: 1.2, type: "spring" }}
            >
                <h1 className="text-2xl font-bold mb-6 text-center">本週班表</h1>
                <div className="grid grid-cols-8 gap-5 divide-y divide-gray-600">
                    <div />
                    {weekDays.map((day, idx) => (
                        <div key={idx} className="text-center font-semibold">{day}</div>
                    ))}
                    {timeSlots.map((slotLabel, slotIdx) => (
                        <React.Fragment key={slotLabel}>
                            <div className="font-semibold">{slotLabel}</div>
                            {(schedules[slotIdx] || []).map((doctor, dayIdx) => (
                                <div key={dayIdx} className="text-center font-semibold flex flex-col gap-1 py-8">
                                    {loading
                                        ? <span className="text-gray-400">載入中</span>
                                        : doctor
                                            ? <span className="text-green-600 font-bold">{doctor}</span>
                                            : <span className="text-gray-300">—</span>
                                    }
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}