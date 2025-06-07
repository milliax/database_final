"use client"

import { LoadingCircle } from "@/components/loading";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";


export default function AdminSchedulePage() {
    const [searchParam, setSearchParam] = React.useState<string>("");
    const [patientHistory, setPatientHistory] = React.useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    const handleSearch = async () => {
        if (searchParam.trim() === "") {
            setPatientHistory([]);
            Swal.fire({
                icon: 'warning',
                title: '搜尋條件不可為空',
                text: '請輸入病人姓名或身份證字號',
            });
            return;
        }
        if (loading) return; // 防止重複提交

        setLoading(true);
        setSelectedPatient(null); // 清除選擇的病人

        const res = await fetch(`/api/admin/patient/history/${searchParam}`, {
            method: 'GET',
        })
        if (!res.ok) {
            const errorData = await res.json();
            Swal.fire({
                icon: 'error',
                title: '搜尋失敗',
                text: errorData.error || '無法搜尋病歷紀錄',
            });
            return;
        }
        const data = await res.json();
        setPatientHistory(data);
        setLoading(false);
    }

    // useEffect(() => {
    //     if (searchParam === "") {
    //         setPatientHistory([]);
    //         return;
    //     }
    //     handleSearch();
    // }, [searchParam]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 w-full text-center">病歷紀錄</h1>
            <div className="mb-4 flex flex-col w-full items-center">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }} className="flex flex-row items-center space-x-2">
                    <input
                        type="text"
                        placeholder="搜尋病人姓名或身份證字號"
                        className="w-80 h-10 border border-gray-300 rounded-lg text-center bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchParam}
                        onChange={(e) => setSearchParam(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={clsx("px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 h-10",
                            loading ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                    >
                        {loading ? (
                            <div className="flex h-full w-full">
                                <LoadingCircle scale="XS" color="ORANGE" />
                            </div>
                        ) : (
                            <span>
                                搜尋
                            </span>
                        )}
                    </button>
                </form>
                <div className="mt-4 w-full max-w-4xl">
                    {patientHistory.length > 0 ? (
                        <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-4 space-y-4 md:space-y-0">
                            <ul className={clsx("space-y-4",
                                selectedPatient === null ? "w-full" : "w-2/5",
                            )}>
                                {patientHistory.map((history, index) => (
                                    <li key={history.id} className="p-4 bg-white rounded-lg shadow-md cursor-pointer relative"
                                        onClick={() => setSelectedPatient(history.id)}>
                                        <h2 className="text-lg font-semibold">{history.name}</h2>
                                        <p className="text-gray-600">身份證字號: {history.patient.id_card_number}</p>
                                        <p className="text-gray-500 text-sm">日期: {history.patient.consultations.length === 0 ? "尚未看診" : new Date(history.patient.consultations[0].createdAt).toLocaleDateString()}</p>
                                        <button
                                            className="absolute right-4 bottom-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                            type="button"
                                            onClick={e => {
                                                e.stopPropagation();
                                                setOpenIdx(openIdx === index ? null : index);
                                            }}
                                        >
                                            {openIdx === index ? "收合" : "詳細資料"}
                                        </button>
                                        {openIdx === index && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                                                {history.patient.consultations.length === 0 ? (
                                                    <div>尚未看診</div>
                                                ) : (
                                                    history.patient.consultations
                                                        .sort((a: Consultation, b: Consultation) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                                        .map((consultation: Consultation, cidx: number) => (
                                                            <div key={consultation.id} className="mb-4 border-b last:border-b-0 pb-4 last:pb-0">
                                                                <div className="mb-1 text-sm text-gray-500">
                                                                    看診日期：{new Date(consultation.createdAt).toLocaleDateString()}
                                                                </div>
                                                                <div className="mb-1">
                                                                    <span className="font-semibold">詳細資料：</span>
                                                                    {consultation.description || "無"}
                                                                </div>
                                                                <div className="mb-1">
                                                                    <span className="font-semibold">醫院開藥：</span>
                                                                    {consultation.prescription || "無"}
                                                                </div>
                                                                <div className="mb-1">
                                                                    <span className="font-semibold">回饋：</span>
                                                                    {consultation.Feedback && consultation.Feedback.length > 0
                                                                        ? consultation.Feedback[0].comment || "無"
                                                                        : "無"}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">評分：</span>
                                                                    {consultation.Feedback && consultation.Feedback.length > 0 && consultation.Feedback[0].rating
                                                                        ? "★".repeat(consultation.Feedback[0].rating)
                                                                        : "無"}
                                                                </div>
                                                            </div>
                                                        ))
                                                )}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            <div className={clsx("bg-neutral-50 shadow-xl rounded-md transition-all duration-500 ease-in-out flex items-center justify-center",
                                selectedPatient === null ? "h-0 w-0" : "w-full ",
                            )}>
                                <HistoryConsultations selectedPatient={selectedPatient} />
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">沒有找到相關病歷紀錄。</p>
                    )}
                </div>
            </div>
        </div >
    );

}

const HistoryConsultations = ({
    selectedPatient
}: {
    selectedPatient: string | null
}) => {
    const [display, setDisplay] = useState<boolean>(false);

    useEffect(() => {
        if (selectedPatient) {
            setTimeout(() => {
                setDisplay(true);
            }, 500);
        } else {
            setDisplay(false);
        }
    }, [selectedPatient]);

    return (
        <React.Fragment>
            {display ? (
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">病歷紀錄</h2>
                    {/* 這裡可以放置病歷紀錄的內容 */}
                    {selectedPatient}
                </div>
            ): (
                <></>
            )}
        </React.Fragment>
    );
}

type Feedback = {
    comment?: string;
    rating?: number;
};

type Consultation = {
    id: string;
    createdAt: string;
    description?: string;
    prescription?: string;
    Feedback?: Feedback[];
};