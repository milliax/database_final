"use client"

import React, { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import TextareaAutosize from "react-textarea-autosize"
import clsx from "clsx";

import { numberInLetter } from "@/lib/utils";
import { uploadImageToSupabase } from '@/lib/uploadHelper';
import { set } from "date-fns";

export default function AdminSchedulePage() {
    const [searchParam, setSearchParam] = React.useState<string>("");
    const [patientHistory, setPatientHistory] = React.useState<any[]>([]);

    const handleSearch = async () => {
        if (searchParam.trim() === "") {
            Swal.fire({
                icon: 'warning',
                title: '搜尋條件不可為空',
                text: '請輸入病人姓名或身份證字號',
            });
            return;
        }
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
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            搜尋
                        </button>
                    </form>
                <div className="mt-4 w-full max-w-3xl">
                    {patientHistory.length > 0 ? (
                        <ul className="space-y-4">
                            {patientHistory.map((history, index) => (
                                <li key={history.id} className="p-4 bg-white rounded-lg shadow-md">
                                    <h2 className="text-lg font-semibold">{history.name}</h2>
                                    <p className="text-gray-600">身份證字號: {history.patient.id_card_number}</p>
                                    <p className="text-gray-500 text-sm">日期: {history.patient.consultations.length === 0 ? "尚未看診" : new Date(history.patient.consultations[0].createdAt).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">沒有找到相關病歷紀錄。</p>
                    )}
                </div>
            </div>
        </div>
    );

}
