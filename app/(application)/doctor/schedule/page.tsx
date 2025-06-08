"use client";
import { numberInLetter } from "@/lib/utils";
// import { Session } from "inspector/promises";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { clsx } from "clsx";
import { LoadingCircle } from "@/components/loading";
import { date } from "zod";
import { motion, AnimatePresence } from "framer-motion";

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

    // const [dateSelected, setDateSelected] = useState<Date | null>(null);

    const [slotSelected, setSlotSelected] = useState<number | null>(null);

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

    // console.log("Start of the week:", startDayOfWeek);

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
                                                slotSelected={slotSelected}
                                                setSlotSelected={setSlotSelected}

                                                index={index}
                                            />
                                        </React.Fragment>
                                    )
                                }
                                return (
                                    <CellBody
                                        key={index}
                                        isAvailable={isAvailable === 1}
                                        slotSelected={slotSelected}
                                        setSlotSelected={setSlotSelected}

                                        index={index}
                                    />
                                )
                            })}
                        </div>
                    </React.Fragment>
                )}
            </div>

            {slotSelected !== null && (
                <div className="flex flex-col items-center mt-10 gap-3">
                    <h2 className="text-4xl font-semibold ">病患名單</h2>

                    <PatientInfo slot={slotSelected} />
                </div>
            )}
        </div>
    );
}

const CellBody = ({
    isAvailable,
    slotSelected,
    setSlotSelected,

    index
}: {
    isAvailable: boolean;
    slotSelected?: number | null;
    setSlotSelected?: Dispatch<SetStateAction<number | null>>;

    index: number;
}) => {
    return (
        <div className={clsx("flex flex-col items-center p-2 border border-gray-300 rounded-md",
            isAvailable ? (slotSelected === index ? "bg-green-700" : "bg-slate-600") : "bg-slate-100",
        )} onClick={() => {
            if (isAvailable) {
                setSlotSelected && setSlotSelected(index);
            }
        }} >
            {isAvailable && (
                <span className="text-sm text-white cursor-pointer ">{isAvailable ? "病患名單" : ""}</span>
            )}
        </div>
    )
}

const PatientInfo = ({
    slot
}: {
    slot: number;
}) => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailPatientId, setDetailPatientId] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    let dateSelected: Date | null = null;

    const now = new Date()
    const startDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 6);
    const todayWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // console.log("start day of week, ", startDayOfWeek);

    dateSelected = new Date(startDayOfWeek.getFullYear(), startDayOfWeek.getMonth(), startDayOfWeek.getDate() + slot % 7);

    if (dateSelected < todayWithoutTime) {
        dateSelected = new Date(dateSelected.getFullYear(), dateSelected.getMonth(), dateSelected.getDate() + 7);
    }

    const fetchPatients = async () => {
        setLoading(true)

        try {
            console.log("date")
            console.log(dateSelected, slot)
            const response = await fetch(`/api/doctor/schedule/patients`, {
                method: "POST",
                body: JSON.stringify({
                    date: dateSelected, // 假設你要查詢今天的病患名單
                    slot: slot
                })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch patients");
            }
            const data = await response.json();
            console.log(data)
            setPatients(data.patients || []);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    }

    // 取得病患歷史紀錄
    const fetchHistory = async (patientId: string) => {
        setHistoryLoading(true);
        setDetailPatientId(patientId);
        try {
            const res = await fetch(`/api/doctor/patient-history?patientId=${patientId}`);
            const data = await res.json();
            setHistory(data.history || []);
        } catch {
            setHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients()
    }, [slot])

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4 text-center">
                時段：{dateSelected.toLocaleDateString()} {slot < 7 ? "早班" : (slot < 14) ? "午班" : "晚班"}
            </h3>
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <LoadingCircle color="BLUE" scale="SM" />
                </div>
            ) : (
                <React.Fragment>
                    {patients.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 border-b">#</th>
                                        <th className="px-4 py-2 border-b">姓名</th>
                                        <th className="px-4 py-2 border-b">身分證字號</th>
                                        <th className="px-4 py-2 border-b">詳細資料</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient, index) => (
                                        <tr key={index} className="hover:bg-green-50">
                                            <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                                            <td className="px-4 py-2 border-b">{patient.patient.user.name}</td>
                                            <td className="px-4 py-2 border-b">{patient.patient.user.email}</td>
                                            <td className="px-4 py-2 border-b text-center">
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                    onClick={() => fetchHistory(patient.patient.id)}
                                                >
                                                    詳細資料
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xl text-gray-500 font-semibold py-10">此時段無病患名單</p>
                    )}
                </React.Fragment>
            )}

            {/* 懸浮視窗顯示歷史紀錄 */}
            {detailPatientId && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                    <AnimatePresence>
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.8, y: 60 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 60 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                bounce: 0.35,
                                duration: 0.4,
                            }}
                            className="bg-white rounded-2xl shadow-2xl p-8 min-w-[350px] max-w-lg"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xl font-bold">歷史看診紀錄</h4>
                                <button
                                    onClick={() => setDetailPatientId(null)}
                                    className="text-gray-500 hover:text-black text-lg"
                                >
                                    關閉
                                </button>
                            </div>
                            {historyLoading ? (
                                <div className="text-center py-8">載入中...</div>
                            ) : history.length === 0 ? (
                                <div className="text-gray-500 py-8">無歷史紀錄</div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {history.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                                        >
                                            <div className="flex flex-wrap gap-4 mb-2 text-sm text-gray-600">
                                                <span><b>日期：</b>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                <span><b>評分：</b>{item.rating ?? "無"}</span>
                                            </div>
                                            <div className="mb-2">
                                                <b>描述：</b>
                                                <div className="whitespace-pre-line break-words text-gray-800">{item.description || "無"}</div>
                                            </div>
                                            <div className="mb-2">
                                                <b>處方：</b>
                                                <div className="whitespace-pre-line break-words text-gray-800">{item.prescription || "無"}</div>
                                            </div>
                                            <div>
                                                <b>評論：</b>
                                                <div className="whitespace-pre-line break-words text-gray-800">{item.comment ?? "無"}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div >
    )
}