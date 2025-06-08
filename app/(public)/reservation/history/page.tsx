"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoadingCircle } from "@/components/loading";
import Swal from "sweetalert2";

type Reservation = {
    id: string;
    department: string;
    doctor: string;
    date: string;
    detail: string;
    prescription?: string;
    commented?: boolean;
    commentContent?: string; // 新增
    commentRating?: number; // 新增
    slot: number;
    appointmentStatus?: string;

    feedback?: {
        comment: string;
        rating: number;
    } | null; // 新增
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
    const [commentError, setCommentError] = useState<string | null>(null);
    const [commentErrorIdx, setCommentErrorIdx] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = () => {
        fetch("/api/reservation/history")
            .then(res => res.json())
            .then(data => {
                // 先分組
                const notCompleted = data.reservations.filter(
                    (r: Reservation) => r.appointmentStatus !== "COMPLETED"
                );
                const completed = data.reservations.filter(
                    (r: Reservation) => r.appointmentStatus === "COMPLETED"
                );
                // 未完成：日期升冪，已完成：日期降冪
                notCompleted.sort((a: Reservation, b: Reservation) => a.date.localeCompare(b.date));
                completed.sort((a: Reservation, b: Reservation) => b.date.localeCompare(a.date));
                // 合併，未完成在上，已完成在下
                setReservations([...notCompleted, ...completed]);
                if (data.userName) setUserName(data.userName);
                setLoading(false);
            });
    }

    const handleCancel = async (idx: number) => {
        setReservations(reservations.filter((_, i) => i !== idx));

        setShowCancelIdx(null);
        setOpenIdx(null);

        const res = await fetch("/api/reservation/cancel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: reservations[idx].id }),
        })

        if (!res.ok) {
            Swal.fire({
                icon: "error",
                title: "取消預約失敗",
                text: "請稍後再試或聯繫客服。",
            })
            fetchReservations();

            return;
        }

        Swal.fire({
            icon: "success",
            title: "預約已取消",
            text: "您的預約已成功取消。",
        });
        fetchReservations();
    };

    const handleSubmitComment = async (idx: number) => {
        const result = await Swal.fire({
            title: "確認送出評論？",
            text: "送出後可再次編輯。",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "確認",
            cancelButtonText: "取消",
        });

        if (result.isConfirmed) {
            setReservations(reservations.map((r, i) =>
                i === idx ? { ...r, commented: true, commentContent: comment, commentRating: rating } : r
            ));

            const res = await fetch("/api/reservation/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: reservations[idx].id,
                    commentContent: comment,
                    commentRating: rating,
                }),
            });

            if(!res.ok) {
                Swal.fire({
                    icon: "error",
                    title: "送出評論失敗",
                    text: "請稍後再試或聯繫客服。",
                });
                return;
            }
            setShowCommentIdx(null);
            setOpenIdx(null);
            // 不要清空 comment，這樣下次還能編輯
            setRating(5);
            fetchReservations();
            Swal.fire({
                icon: "success",
                title: "評論已送出！",
                showConfirmButton: false,
                timer: 1200,
            });
        }
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
            <div className="space-y-4">
                {reservations.length === 0 ? (
                    <React.Fragment>
                        {loading ? (
                            <LoadingCircle />
                        ) : (
                            <motion.div
                                className="text-3xl text-center text-gray-400 py-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                            >
                                沒有預約紀錄
                            </motion.div>
                        )}
                    </React.Fragment>
                ) : (
                    reservations.map((r, idx) => {
                        const isFuture = r.date > today;
                        const isCompleted = r.appointmentStatus === "COMPLETED";
                        return (
                            <motion.div
                                key={r.id || idx}
                                className={`rounded-xl shadow p-5 flex flex-col gap-2 border relative min-h-[140px] transition-all duration-300
                                    ${isCompleted ? "bg-gray-200 border-gray-400" : "bg-white border-gray-200"}`}
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
                                        {`${r.date} ${r.slot === 0 ? "早上" : r.slot === 1 ? "中午" : "晚上"}`}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-2">
                                    <button
                                        className={`bg-green-600 text-white px-4 py-1 rounded transition ${r.commented ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"}`}
                                        disabled={r.commented}
                                        onClick={() => {
                                            if (r.commented) return;
                                            if (showCommentIdx === idx) {
                                                setShowCommentIdx(null);
                                                setCommentError(null);
                                                setCommentErrorIdx(null);
                                            } else if (r.appointmentStatus === "COMPLETED") {
                                                setShowCommentIdx(idx);
                                                setCommentError(null);
                                                setCommentErrorIdx(null);
                                                setComment(r.commentContent || "");
                                            } else {
                                                setCommentError("尚未完成看診無法評論");
                                                setCommentErrorIdx(idx);
                                                setShowCommentIdx(null);
                                            }
                                        }}
                                    >
                                        {r.commented ? "已評論" : showCommentIdx === idx ? "收回評論" : "撰寫評論"}
                                    </button>
                                    <button
                                        className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700 transition"
                                        onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                    >
                                        {openIdx === idx ? "收合詳細" : "詳細資料"}
                                    </button>
                                </div>

                                {/* 新增 詳細資料按鈕 */}
                                {openIdx === idx && (
                                    <div className="mt-4 bg-white border border-gray-300 rounded shadow-lg p-4 min-w-[220px]">
                                        <div className="mb-2">
                                            <span className="font-semibold">Description：</span>
                                            <span>{r.detail || "無"}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Prescription：</span>
                                            <span>{r.prescription || "無"}</span>
                                        </div>
                                        <button
                                            className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                            onClick={async () => {
                                                const result = await Swal.fire({
                                                    title: "確認取消預約？",
                                                    text: "取消後將無法復原。",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonText: "確認",
                                                    cancelButtonText: "返回",
                                                });
                                                if (result.isConfirmed) {
                                                    handleCancel(idx);
                                                }
                                            }}
                                        >
                                            取消預約
                                        </button>
                                    </div>
                                )}

                                {/* 評論錯誤訊息 */}
                                {commentError && commentErrorIdx === idx && (
                                    <div className="text-red-600 font-semibold mb-2">{commentError}</div>
                                )}

                                {/* 評論區塊 */}
                                {showCommentIdx === idx && !r.commented && (
                                    <div className="mt-4 bg-white border border-gray-300 rounded shadow-lg p-4 min-w-[220px]">
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
                                )}

                                {/* 已評論顯示結果 */}
                                {r.commented && (
                                    <div className="mt-4 bg-white border border-gray-300 rounded shadow-lg p-4 min-w-[220px]">
                                        <div className="mb-2 font-bold text-lg">我的評論</div>
                                        <div className="mb-2 whitespace-pre-line">{r?.feedback?.comment ?? ""}</div>
                                        <div>
                                            <span className="font-semibold mr-2">滿意度：</span>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span
                                                    key={star}
                                                    className={`text-2xl ${star <= (r.feedback?.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                                >★</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div >
    );
}