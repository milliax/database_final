"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorClinicPage() {
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
        if (confirm) fetchClinicStatus();
    }, [confirm]);

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

    // 結束看診
    const endClinic = async () => {
        // 呼叫 API 將所有未報到的病人標記為未到
        await fetch("/api/clinic/end", { method: "POST" });
        router.push("/doctor");
    };

    // 新增：進入頁面先詢問是否開始看診
    if (!confirm) {
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
                            onClick={() => setConfirm(true)}
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

    if (loading) return <div className="text-center mt-10">載入中...</div>;

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
            {/* 右下角結束看診按鈕 */}
            <button
                className="fixed bottom-10 right-10 bg-red-600 text-white px-8 py-3 rounded-xl text-xl font-bold shadow hover:bg-red-700 transition active:scale-95 z-50"
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
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                onClick={endClinic}
                            >
                                是
                            </button>
                            <button
                                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
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
