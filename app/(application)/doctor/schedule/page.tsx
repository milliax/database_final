"use client";
import { numberInLetter } from "@/lib/utils";
// import { Session } from "inspector/promises";
import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { LoadingCircle } from "@/components/loading";

// 假設你有取得登入醫生的 id
// 實際專案請用 session 或 context 取得 doctorId
const doctorId = "CURRENT_DOCTOR_ID";

type ScheduleCell = {
    hasSchedule: boolean;
    scheduleInfo?: string; // 你可以放更多資訊
};

export default function DoctorSchedulePage() {
    const [schedule, setSchedule] = useState<number[]>([]);
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
                // const newSchedule = Array(3).fill(null).map(() => Array(7).fill({ hasSchedule: false }));
                // data.forEach((item: { day: number; slot: number; info?: string }) => {
                //     newSchedule[item.slot][item.day] = { hasSchedule: true, scheduleInfo: item.info };
                // });

                setSchedule(data.schedule || []);
                setLoading(false);

                console.log(data.schedule)
            });
    }, []);

    const today = new Date();
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6);

    console.log("Start of the week:", startDayOfWeek);

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center">本週時段表</h1>
            <div className="overflow-x-auto">

                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <LoadingCircle color="BLUE" scale="SM" />
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="grid grid-cols-8 ">
                            <div />
                            {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                                let dayRender = new Date(startDayOfWeek.getFullYear(), startDayOfWeek.getMonth(), startDayOfWeek.getDate() + d);

                                if (dayRender < todayWithoutTime) {
                                    dayRender = new Date(dayRender.getFullYear(), dayRender.getMonth(), dayRender.getDate() + 7);
                                }

                                return (
                                    <div key={dayRender.toISOString()} className={clsx("flex flex-col items-center p-2 border border-gray-300 rounded-md select-none",
                                        (dayRender.getDay() === today.getDay() && dayRender.getMonth() === today.getMonth()) ? "bg-blue-100" : "bg-white"
                                    )}>
                                        <span className="text-sm text-black">{`${dayRender.getMonth() + 1}/${dayRender.getDate()}`}</span>
                                    </div>
                                )
                            })}

                            {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => {
                                if (d === 0) {
                                    return (
                                        <div key={Math.random()} className="flex flex-col items-center p-2 border border-gray-300 rounded-md select-none">
                                            <span className="text-sm text-black" />
                                        </div>
                                    )
                                }
                                return (
                                    <div key={Math.random()} className="flex flex-col items-center p-2 border border-gray-300 rounded-md select-none">
                                        <span className="text-sm text-black">{`${numberInLetter(d - 1)}`}</span>
                                    </div>
                                )
                            })}
                            {schedule.map((isAvailable, index) => {
                                if (index === 0 || index === 7 || index === 14) {
                                    return (
                                        <React.Fragment key={index}>
                                            <div className="flex flex-col items-center p-2 border border-gray-300 rounded-md select-none">
                                                {index === 0 ? (
                                                    <span className="text-sm text-black">上午</span>
                                                ) : index === 7 ? (
                                                    <span className="text-sm text-black">下午</span>
                                                ) : index === 14 ? (
                                                    <span className="text-sm text-black">晚上</span>
                                                ) : null}
                                            </div>

                                            {/* <div className={clsx("flex flex-col items-center p-2 border border-gray-300 rounded-md cursor-pointer",
                                                schedule[index] ? "bg-slate-600" : "bg-slate-100")}
                                                onClick={() => {

                                                }}
                                            >
                                                {schedule[index] && (
                                                    <span className="text-sm text-white">{schedule[index] === 1 ? "病患名單" : ""}</span>
                                                )}
                                            </div> */}
                                            <CellBody
                                                key={index}
                                                isAvailable={isAvailable === 1}
                                            />
                                        </React.Fragment>
                                    )
                                }
                                return (
                                    <CellBody
                                        key={index}
                                        isAvailable={isAvailable === 1}
                                    />
                                )
                            })}
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
}

const CellBody = ({
    isAvailable
}: {
    isAvailable: boolean;
}) => {
    return (
        <div className={clsx("flex flex-col items-center p-2 border border-gray-300 rounded-md",
            isAvailable ? "bg-slate-600" : "bg-slate-100")} onClick={() => {

            }} >
            {isAvailable && (
                <span className="text-sm text-white cursor-pointer">{isAvailable ? "病患名單" : ""}</span>
            )}
        </div>
    )
}