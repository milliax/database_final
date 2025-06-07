"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import TextareaAutosize from "react-textarea-autosize";

export default function PatientBioPage() {
    const { data: session, status } = useSession();
    const [bio, setBio] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    // 取得目前登入使用者的個人資料
    useEffect(() => {
        if (status !== "authenticated") return;
        const fetchPatient = async () => {
            const res = await fetch("/api/patient/me");
            if (!res.ok) {
                setLoading(false);
                return;
            }
            const data = await res.json();
            setBio(data.bio || "");
            setName(data.name || "");
            setLoading(false);
        };
        fetchPatient();
    }, [status]);

    // 更新個人資料
    const updatePatient = async () => {
        const res = await fetch("/api/patient/me", {
            method: "PUT",
            body: JSON.stringify({ bio, name }),
        });
        if (!res.ok) {
            Swal.fire({ icon: "error", title: "更新失敗", text: "請稍後再試" });
            return;
        }
        Swal.fire({ icon: "success", title: "更新成功", text: "個人資料已更新" });
    };

    if (status === "loading" || loading) {
        return <div className="text-center mt-10">載入中...</div>;
    }
    if (status !== "authenticated") {
        return <div className="text-center mt-10">請先登入</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-8 mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">我的個人資料</h1>
            <form
                className="flex flex-col gap-4"
                onSubmit={e => {
                    e.preventDefault();
                    updatePatient();
                }}
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">個人簡介</label>
                    <TextareaAutosize
                        className="w-full border border-gray-300 rounded-md p-2"
                        minRows={3}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="請輸入個人簡介"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                >
                    儲存
                </button>
            </form>
        </div>
    );
}