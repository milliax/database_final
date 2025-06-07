"use client";
import React, { useState, useEffect } from "react";

type Stats = { totalReservations: number; noShowRate: number; avgRating: number };
type DoctorStatsMap = {
    [key: string]: {
        yesterday: Stats;
        lastWeek: Stats;
    };
};

export default function AdminReportChartPage() {
    const [data, setData] = useState<{
        yesterday: Stats;
        lastWeek: Stats;
        doctors: DoctorStatsMap;
    } | null>(null);

    const [selected, setSelected] = useState<"yesterday" | "lastWeek">("yesterday");
    const [doctorName, setDoctorName] = useState("");
    const [doctorResult, setDoctorResult] = useState<{ yesterday: Stats; lastWeek: Stats } | null>(null);

    useEffect(() => {
        fetch("/api/admin/report/summary")
            .then(res => res.json())
            .then(setData);
    }, []);

    if (!data) {
        return <div className="text-center py-20 text-xl">載入中...</div>;
    }

    const current = doctorResult ? doctorResult[selected] : data[selected];

    const handleDoctorSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = data.doctors[doctorName.trim()];
        if (doctorName.trim() && found) {
            setDoctorResult(found);
        } else {
            setDoctorResult(null);
            alert("查無此醫生資料");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">
            {/* 切換按鈕 */}
            <div className="flex gap-4 justify-center mb-2">
                <button
                    className={`px-6 py-2 rounded-lg font-bold border transition 
                        ${selected === "yesterday"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"}`}
                    onClick={() => setSelected("yesterday")}
                >
                    昨天
                </button>
                <button
                    className={`px-6 py-2 rounded-lg font-bold border transition 
                        ${selected === "lastWeek"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"}`}
                    onClick={() => setSelected("lastWeek")}
                >
                    上周
                </button>
            </div>
            {/* 搜尋醫生 */}
            <form className="flex justify-center gap-2" onSubmit={handleDoctorSearch}>
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-48"
                    placeholder="搜尋醫生姓名"
                    value={doctorName}
                    onChange={e => setDoctorName(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    搜尋
                </button>
                {doctorResult && (
                    <button
                        type="button"
                        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        onClick={() => {
                            setDoctorResult(null);
                            setDoctorName("");
                        }}
                    >
                        清除
                    </button>
                )}
            </form>
            {/* 報表卡片 */}
            <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-lg text-gray-500 mb-2">總預約數</div>
                    <div className="text-4xl font-bold text-blue-600">{current.totalReservations}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-lg text-gray-500 mb-2">未到率</div>
                    <div className="text-4xl font-bold text-red-500">{(current.noShowRate * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-lg text-gray-500 mb-2">平均評分</div>
                    <div className="text-4xl font-bold text-yellow-500 flex items-center">
                        {current.avgRating}
                        <span className="ml-2 text-2xl">★</span>
                    </div>
                </div>
            </div>
        </div>
    );
}