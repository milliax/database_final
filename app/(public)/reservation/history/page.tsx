"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Reservation = {
    id: string;
    department: string;
    doctor: string;
    date: string;
    detail: string;
    commented?: boolean;
};

const today = new Date().toISOString().split("T")[0];

export default function ReservationHistoryPage() {
    const [userName, setUserName] = useState("");
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const [showCancelIdx, setShowCancelIdx] = useState<number | null>(null);
    const [showCommentIdx, setShowCommentIdx] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetch("/api/reservation/history")
            .then(res => res.json())
            .then(data => {
                setReservations(
                    data.reservations.sort((a: Reservation, b: Reservation) => b.date.localeCompare(a.date))
                );
                if (data.userName) setUserName(data.userName);
            });
    }, []);

    const handleCancel = (idx: number) => {
        setReservations(reservations.filter((_, i) => i !== idx));
        setShowCancelIdx(null);
        setOpenIdx(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
    };

    const handleSubmitComment = (idx: number) => {
        setReservations(reservations.map((r, i) =>
            i === idx ? { ...r, commented: true } : r
        ));
        setShowCommentIdx(null);
        setOpenIdx(null);
        setComment("");
        setRating(5);
        alert("評論已送出！");
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <motion.h1
                className="text-4xl font-bold text-center mb-6 tracking-widest bg-gray-100 py-8 shadow-md"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                預約紀錄
            </motion.h1>
            <motion.div
                className="mb-6 text-2xl"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <span className="font-semibold">姓名：</span>
                <span>{userName}</span>
            </motion.div>
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
                    <div className="bg-white border border-gray-400 text-black px-8 py-6 rounded shadow text-2xl font-bold">
                        成功取消預約
                    </div>
                </div>
            )}
            <div className="space-y-4">
                {reservations.length === 0 ? (
                    <motion.div
                        className="text-3xl text-center text-gray-400 py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        沒有預約紀錄
                    </motion.div>
                ) : (
                    reservations.map((r, idx) => {
                        const isFuture = r.date > today;
                        const isPast = r.date < today;
                        return (
                            <motion.div
                                key={r.id || idx}
                                className={`rounded-xl shadow p-5 flex flex-col gap-2 border relative min-h-[140px] transition-all duration-300
                                    ${isPast ? "bg-gray-100" : "bg-white"}`}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
                            >
                                <div className="ml-2">
                                    <div>
                                        <span className="font-semibold">看診科別：</span>
                                        {r.department}
                                    </div>
                                    <div>
                                        <span className="font-semibold">醫生姓名：</span>
                                        {r.doctor}
                                    </div>
                                    <div>
                                        <span className="font-semibold">看診日期：</span>
                                        {r.date}
                                    </div>
                                </div>
                                <button
                                    className="absolute right-4 bottom-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                >
                                    {openIdx === idx ? "收合" : "詳細資訊"}
                                </button>
                                {openIdx === idx && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
                                        <div className="mb-2"><span className="font-semibold">詳細資訊：</span>{r.detail}</div>
                                        <div className="flex gap-4 mt-4">
                                            {isFuture ? (
                                                <>
                                                    <button
                                                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                                        onClick={() => setShowCancelIdx(idx)}
                                                    >
                                                        取消預約
                                                    </button>
                                                    {showCancelIdx === idx && (
                                                        <div className="fixed inset-0 flex items-center justify-center bg-gray-200/60 z-50">
                                                            <div className="bg-white p-6 rounded shadow-lg text-center">
                                                                <div className="mb-4 text-xl font-bold">確定要取消預約嗎？</div>
                                                                <div className="flex justify-center gap-6 mt-4">
                                                                    <button
                                                                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                                                                        onClick={() => handleCancel(idx)}
                                                                    >
                                                                        是
                                                                    </button>
                                                                    <button
                                                                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
                                                                        onClick={() => setShowCancelIdx(null)}
                                                                    >
                                                                        否
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {r.commented ? (
                                                        <span className="text-green-600 font-semibold px-2 py-1">已評論</span>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                                                                onClick={() => setShowCommentIdx(idx)}
                                                            >
                                                                撰寫評論
                                                            </button>
                                                            {showCommentIdx === idx && (
                                                                <div className="fixed inset-0 flex items-center justify-center bg-gray-200/60 z-50">
                                                                    <div className="bg-white p-6 rounded shadow-lg w-80">
                                                                        <div className="mb-2 font-bold text-lg">撰寫評論</div>
                                                                        <textarea
                                                                            className="w-full border rounded p-2 mb-4"
                                                                            rows={3}
                                                                            placeholder="請輸入評論內容"
                                                                            value={comment}
                                                                            onChange={e => setComment(e.target.value)}
                                                                        />
                                                                        <div className="mb-4">
                                                                            <span className="font-semibold mr-2">滿意度：</span>
                                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                                <button
                                                                                    key={star}
                                                                                    type="button"
                                                                                    className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                                                                                    onClick={() => setRating(star)}
                                                                                >★</button>
                                                                            ))}
                                                                        </div>
                                                                        <div className="flex justify-center gap-6">
                                                                            <button
                                                                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                                                                onClick={() => handleSubmitComment(idx)}
                                                                            >
                                                                                送出
                                                                            </button>
                                                                            <button
                                                                                className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
                                                                                onClick={() => setShowCommentIdx(null)}
                                                                            >
                                                                                取消
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
