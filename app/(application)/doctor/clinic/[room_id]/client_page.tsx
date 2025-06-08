"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConsultingRoomStatus } from "@/generated/prisma";
import { LoadingCircle } from "@/components/loading";
import Swal from "sweetalert2";
import clsx from "clsx";

import TextareaAutosize from "react-textarea-autosize";

export default function DoctorClinicPage({
    roomId,
    status,
    isClinicWatchingTime
}: {
    roomId: string
    status: ConsultingRoomStatus
    isClinicWatchingTime: boolean
}) {
    const [loading, setLoading] = useState(true);
    const [currentNumber, setCurrentNumber] = useState<number>(0);
    const [currentPatient, setCurrentPatient] = useState<any>(null);
    const [description, setDescription] = useState("");
    const [prescription, setPrescription] = useState("");
    const [queue, setQueue] = useState<any[]>([]);
    const [patientStatus, setPatientStatus] = useState<{ [id: string]: string }>({});
    const [confirm, setConfirm] = useState(false);
    const [showEndConfirm, setShowEndConfirm] = useState(false);

    const router = useRouter();

    // 取得診間狀態
    const fetchClinicStatus = async () => {
        // setLoading(true);
        const res = await fetch(`/api/doctor/clinic/${roomId}`);
        const data = await res.json();
        console.log(data)

        setCurrentNumber(data.number_now);
        setCurrentPatient(data.currentPatient);

        setQueue(data.consultations);
        setDescription(data.currentPatient?.description || "");
        setPrescription(data.currentPatient?.prescription || "");
        setLoading(false);
    };

    useEffect(() => {
        if (status !== "PENDING") fetchClinicStatus();
    }, [status]);

    // 叫下一號
    const nextPatient = async () => {
        const res = await fetch(`/api/doctor/clinic/${roomId}/next`);

        if (!res.ok) {
            const result = await res.json();

            if (result.error === "No consultations found") {
                Swal.fire({
                    icon: "info",
                    title: "沒有候診病人",
                    text: "目前沒有病人需要看診。",
                })
            }
        }

        fetchClinicStatus();
    };

    // 儲存病歷
    const saveRecord = async (id: string) => {
        const res = await fetch(`/api/doctor/clinic/consultation/${id}/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description,
                prescription,
            }),
        });

        if (!res.ok) {
            const result = await res.json();
            console.log(result)
            Swal.fire({
                icon: "error",
                title: "儲存失敗",
                text: result.error?.[0].message || "無法儲存病歷，請稍後再試。",
            });
            return;
        }
        fetchClinicStatus();
    };

    // 狀態切換
    const handleStatus = async (id: string, status: string) => {
        setPatientStatus(prev => ({ ...prev, [id]: status }));

        if (status === "consulting") {
            // TODO: 看診中

        } else if (status === "checked_in") {

            const res = await fetch(`/api/doctor/clinic/consultation/${id}/check_in`)
            if (!res.ok) {
                const result = await res.json();
                Swal.fire({
                    icon: "error",
                    title: "報到失敗",
                    text: result.error || "無法完成報到，請稍後再試。",
                });
                return;
            }
            fetchClinicStatus();
        }
    };

    // 結束看診
    const endClinic = async () => {
        const res = await fetch(`/api/doctor/clinic/${roomId}/end`);
        if (res.ok) {
            router.push("/doctor");
            return;
        }
        Swal.fire({
            icon: "error",
            title: "結束看診失敗",
            text: "無法結束看診，請稍後再試。",
        })
    };

    // 新增：進入頁面先詢問是否開始看診
    if (status === "PENDING" && !isClinicWatchingTime) {
        // 取得現在日期與時段
        const now = new Date();
        const dateStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
        const hour = now.getHours();
        let shift = "";
        let shiftTime = "";
        if (hour >= 7 && hour < 11) {
            shift = "早班";
            shiftTime = "7:00-11:00";
        } else if (hour >= 13 && hour < 17) {
            shift = "午班";
            shiftTime = "13:00-17:00";
        } else if (hour >= 18 && hour < 22) {
            shift = "晚班";
            shiftTime = "18:00-22:00";
        } else {
            shift = "非看診時段";
            shiftTime = "";
        }

        return (
            <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ background: "rgba(0,0,0,0.5)" }}
            >
                <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center gap-6 min-w-[320px]">
                    <h2 className="text-xl font-bold mb-2">是否開始看診？</h2>
                    <div className="text-gray-700 text-lg mb-2">
                        <span className="font-semibold">{dateStr}</span>
                    </div>
                    <div className="text-gray-700 text-lg mb-4">
                        <span className="font-semibold">{shift}</span>
                        {shiftTime && <span className="ml-2 text-sm text-gray-500">({shiftTime})</span>}
                    </div>
                    <div className="flex gap-6 mt-4">
                        <button
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                            onClick={() => {
                                // update clinic room status to progressing

                                fetch(`/api/doctor/clinic/${roomId}/start`)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        if (data.error) {
                                            alert(data.error);
                                        } else {
                                            // reload this page
                                            router.push(`/doctor/clinic/${roomId}`);
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Error starting clinic:", error);
                                        alert("無法開始看診，請稍後再試。");
                                    })
                            }}
                        >
                            是
                        </button>
                        <button
                            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                            onClick={() => router.push("/doctor")}
                        >
                            否
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <div className="text-center mt-10">
        <LoadingCircle />
    </div>;

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center py-10 relative">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-4xl">
                {/* 上方：目前號碼 + 候診名單 */}
                <div className="flex justify-between items-start mb-10">
                    {/* 左上：目前號碼 */}
                    <div>
                        <div className="text-lg text-gray-500 mb-2">目前號碼</div>
                        <div className="text-6xl font-bold text-green-700">{currentNumber}</div>
                        <button
                            className="mt-4 bg-green-600 text-white px-8 py-3 rounded-xl text-xl font-bold shadow hover:bg-green-700 transition active:scale-95 cursor-pointer"
                            onClick={nextPatient}
                        >
                            叫下一號
                        </button>
                    </div>
                    {/* 右上：即將來的病人 */}
                    <div className="w-2/3">
                        <div className="text-lg font-semibold text-gray-700 mb-2">即將來的病人</div>
                        <ul className="space-y-2">
                            {queue && queue.length > 0 ? (
                                queue.map((consultation, idx) => (
                                    <li key={consultation.id} className={clsx("rounded px-4 py-2 flex items-center justify-between",
                                        consultation.consultingStatus === "PENDING" ? "bg-green-100" : (
                                            consultation.consultingStatus === "IN_PROGRESS" ? "bg-blue-100" : (
                                                consultation.consultingStatus === "COMPLETED" ? "bg-green-300" : "bg-red-100"
                                            ))
                                    )}>
                                        <div>
                                            <span className="font-semibold">{consultation.patient.user.name}</span>
                                            <span className="ml-4 text-gray-500">號碼 {idx + 1}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {consultation.consultingStatus === "PENDING" && (
                                                <button
                                                    className={`px-3 py-1 rounded text-sm transition cursor-pointer 
                                                    ${patientStatus[consultation.id] === "checked_in"
                                                            ? "bg-blue-700 text-white"
                                                            : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                                    onClick={() => handleStatus(consultation.id, "checked_in")}
                                                >
                                                    報到
                                                </button>
                                            )}
                                            {/* <button
                                                className={`px-3 py-1 rounded text-sm transition 
                                                    ${patientStatus[consultation.id] === "consulting"
                                                        ? "bg-green-700 text-white"
                                                        : "bg-green-500 text-white hover:bg-green-600"}`}
                                                onClick={() => handleStatus(consultation.id, "consulting")}
                                            >
                                                看診
                                            </button> */}
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-400 px-4 py-2">目前沒有候診病人</li>
                            )}
                        </ul>
                    </div>
                </div>
                {/* 下方：當前病患資訊 */}
                {currentNumber !== 0 && (
                    <div className="mt-8">
                        <div className="text-lg font-semibold text-gray-700 mb-2">當前病患：{queue[currentNumber - 1].patient.user.name}</div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-1">病情描述</label>
                            <TextareaAutosize
                                className="w-full border rounded p-2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="請輸入病情描述"
                                cols={3}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-1">處方</label>
                            <TextareaAutosize
                                className="w-full border rounded p-2"
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                                placeholder="請輸入處方內容"
                                cols={3}
                            />
                        </div>
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition cursor-pointer"
                            onClick={() => {
                                saveRecord(queue[currentNumber - 1].id);
                            }}
                        >
                            儲存
                        </button>
                    </div>
                )}
            </div>
            {/* 右下角結束看診按鈕 */}
            <button
                className="fixed bottom-10 right-10 bg-red-600 text-white px-8 py-3 rounded-xl text-xl font-bold shadow hover:bg-red-700 transition active:scale-95 z-50 cursor-pointer"
                onClick={() => setShowEndConfirm(true)}
            >
                結束看診
            </button>
            {/* 結束看診確認框 */}
            {showEndConfirm && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center gap-6 min-w-[320px]">
                        <h2 className="text-xl font-bold mb-2">確定要結束看診嗎？</h2>
                        <div className="text-gray-700 text-lg mb-4">
                            所有未報到的病人將自動標記為未到
                        </div>
                        <div className="flex gap-6 mt-4">
                            <button
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 cursor-pointer"
                                onClick={endClinic}
                            >
                                是
                            </button>
                            <button
                                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 cursor-pointer"
                                onClick={() => setShowEndConfirm(false)}
                            >
                                否
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}