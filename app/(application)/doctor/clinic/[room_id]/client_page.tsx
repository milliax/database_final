"use client";

import { useEffect, useState } from "react";

export default function DoctorClinicPageWithRoomClient({
    roomId
}: {
    roomId: string
}) {
    const [loading, setLoading] = useState(true);
    const [currentNumber, setCurrentNumber] = useState<number>(0);
    const [currentPatient, setCurrentPatient] = useState<any>(null);
    const [description, setDescription] = useState("");
    const [prescription, setPrescription] = useState("");
    const [queue, setQueue] = useState<any[]>([]);
    const [patientStatus, setPatientStatus] = useState<{ [id: string]: string }>({});

    // 取得診間狀態
    const fetchClinicStatus = async () => {
        setLoading(true);
        const res = await fetch("/api/clinic");
        const data = await res.json();
        setCurrentNumber(data.currentNumber);
        setCurrentPatient(data.currentPatient);
        setQueue(data.queue);
        setDescription(data.currentPatient?.description || "");
        setPrescription(data.currentPatient?.prescription || "");
        setLoading(false);
    };

    useEffect(() => {
        fetchClinicStatus();
    }, []);

    // 叫下一號
    const nextPatient = async () => {
        await fetch("/api/clinic/next", { method: "POST" });
        fetchClinicStatus();
    };

    // 儲存病歷
    const saveRecord = async () => {
        await fetch("/api/clinic/record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: currentPatient?.id,
                description,
                prescription,
            }),
        });
        fetchClinicStatus();
    };

    // 狀態切換
    const handleStatus = (id: string, status: string) => {
        setPatientStatus(prev => ({ ...prev, [id]: status }));
        // 這裡可加呼叫後端 API 更新狀態
    };

    if (loading) return <div className="text-center mt-10">載入中...</div>;

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center py-10">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-4xl">
                {/* 上方：目前號碼 + 候診名單 */}
                <div className="flex justify-between items-start mb-10">
                    {/* 左上：目前號碼 */}
                    <div>
                        <div className="text-lg text-gray-500 mb-2">目前號碼</div>
                        <div className="text-6xl font-bold text-green-700">{currentNumber}</div>
                        <button
                            className="mt-4 bg-green-600 text-white px-8 py-3 rounded-xl text-xl font-bold shadow hover:bg-green-700 transition active:scale-95"
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
                                queue.map((p) => (
                                    <li key={p.id} className="bg-green-100 rounded px-4 py-2 flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold">{p.name}</span>
                                            <span className="ml-4 text-gray-500">號碼 {p.number}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className={`px-3 py-1 rounded text-sm transition 
                                                    ${patientStatus[p.id] === "checked_in"
                                                        ? "bg-blue-700 text-white"
                                                        : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                                onClick={() => handleStatus(p.id, "checked_in")}
                                            >
                                                報到
                                            </button>
                                            <button
                                                className={`px-3 py-1 rounded text-sm transition 
                                                    ${patientStatus[p.id] === "consulting"
                                                        ? "bg-green-700 text-white"
                                                        : "bg-green-500 text-white hover:bg-green-600"}`}
                                                onClick={() => handleStatus(p.id, "consulting")}
                                            >
                                                看診
                                            </button>
                                            <button
                                                className={`px-3 py-1 rounded text-sm transition 
                                                    ${patientStatus[p.id] === "absent"
                                                        ? "bg-gray-600 text-white"
                                                        : "bg-gray-400 text-white hover:bg-gray-500"}`}
                                                onClick={() => handleStatus(p.id, "absent")}
                                            >
                                                未到
                                            </button>
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
                {currentPatient && (
                    <div className="mt-8">
                        <div className="text-lg font-semibold text-gray-700 mb-2">當前病患：{currentPatient.name}</div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-1">病情描述</label>
                            <textarea
                                className="w-full border rounded p-2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-1">處方</label>
                            <textarea
                                className="w-full border rounded p-2"
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                            />
                        </div>
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
                            onClick={saveRecord}
                        >
                            儲存
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
