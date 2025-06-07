"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import TextareaAutosize from "react-textarea-autosize";
import { uploadImageToSupabase } from "@/lib/uploadHelper";
import { motion } from "framer-motion";

export default function PatientBioPage() {
    const { data: session, status } = useSession();
    const [bio, setBio] = useState("");
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyPhone, setEmergencyPhone] = useState("");
    const [email, setEmail] = useState("");
    const [idCardImage, setIdCardImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            setLoading(false);
            return;
        }
        if (status !== "authenticated") return;
        const fetchPatient = async () => {
            const res = await fetch("/api/patient/profile");
            if (!res.ok) {
                setLoading(false);
                return;
            }
            const data = await res.json();
            setBio(data.bio || "");
            setName(data.name || "");
            setBirthDate(data.birth_date ? data.birth_date.slice(0, 10) : "");
            setPhone(data.phone || "");
            setAddress(data.address || "");
            setEmergencyName(data.emergency_contact_name || "");
            setEmergencyPhone(data.emergency_contact_phone || "");
            setEmail(data.email || "");
            setIdCardImage(data.id_card_image || "");
            setLoading(false);
        };
        fetchPatient();
    }, [status]);

    const updatePatient = async () => {
        const res = await fetch("/api/patient/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bio,
                name,
                birth_date: birthDate,
                phone,
                address,
                emergency_contact_name: emergencyName,
                emergency_contact_phone: emergencyPhone,
                email,
                id_card_image: idCardImage,
            }),
        });
        if (!res.ok) {
            Swal.fire({ icon: "error", title: "更新失敗", text: "請稍後再試" });
            return;
        }
        Swal.fire({ icon: "success", title: "更新成功", text: "個人資料已更新" });
        // 新增這段
        const res2 = await fetch("/api/patient/profile");
        const data2 = await res2.json();
        console.log("最新 patient profile", data2);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            const file = e.target.files[0];
            setPreviewUrl(URL.createObjectURL(file));
            try {
                const result = await uploadImageToSupabase(file);
                // result.url 可能是 "doctor-images/xxx.jpg" 或 "patient-images/xxx.jpg"
                const fullUrl = result.url.startsWith("http")
                    ? result.url
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${result.url}`;
                setIdCardImage(fullUrl);
                await fetch("/api/patient/profile", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_card_image: fullUrl }),
                });
                const res2 = await fetch("/api/patient/profile");
                const data2 = await res2.json();
                setIdCardImage(data2.id_card_image || "");
                setPreviewUrl("");
            } catch (err) {
                alert("上傳失敗");
            }
            setUploading(false);
        }
    };

    if (status === "loading" || loading) {
        return <div className="text-center mt-10">載入中...</div>;
    }
    if (status !== "authenticated") {
        return <div className="text-center mt-30">請先登入!</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="relative max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-12 mt-10"
            >
                {/* 中左大圓形證件照 */}
                <div className="flex items-center mb-8">
                    {(previewUrl || idCardImage) && (
                        <img
                            src={previewUrl || idCardImage}
                            alt="證件照片"
                            className="w-48 h-48 object-cover rounded-full border-4 border-green-200 bg-white shadow-lg mr-10"
                            style={{ opacity: uploading ? 0.5 : 1 }}
                        />
                    )}
                    <h1 className="text-4xl font-bold text-gray-800">我的個人資料</h1>
                </div>
                <hr className="mb-8 border-green-200" />
                <form
                    className="flex flex-col gap-6"
                    onSubmit={e => {
                        e.preventDefault();
                        updatePatient();
                    }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">生日(密碼)</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">緊急聯絡人姓名</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={emergencyName}
                            onChange={e => setEmergencyName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">緊急聯絡人電話</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={emergencyPhone}
                            onChange={e => setEmergencyPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">上傳個人證件照片</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 transition active:scale-95"
                    >
                        儲存
                    </button>
                </form>
            </motion.div>
        </div>
    );
}