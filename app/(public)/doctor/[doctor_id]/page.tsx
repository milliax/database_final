"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function DoctorDetailPage() {
    const params = useParams();
    const doctor_id = params?.doctor_id as string;
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!doctor_id) return;
        fetch(`/api/doctors/${doctor_id}`)
            .then((res) => res.json())
            .then((data) => {
                setDoctor(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("API 請求失敗:", error);
                setLoading(false);
            });
    }, [doctor_id]);

    if (loading) return <p className="text-center mt-10">載入中...</p>;
    if (!doctor) return <p className="text-center mt-10">找不到醫生資料</p>;

    // 取出詳細資料
    const bioBlocks = (doctor.doctor?.bio || "").split("\n").filter((block: string) => block.trim() !== "");
    const departmentName = doctor.doctor?.department?.name || "未指定";
    const updatedAt = doctor.doctor?.updatedAt || doctor.updatedAt;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center text-green-700 mb-6">醫生詳細資訊</h1>
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-200 flex flex-col md:flex-row items-center gap-6">
                <div className="w-40 h-40 relative rounded-full overflow-hidden border border-gray-300">
                    <Image src={doctor.image || "/images/default-doctor.jpg"} alt={doctor.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-green-800">主治醫師：{doctor.name}</h2>
                    <div className="mt-2 text-gray-600 text-lg">科別：{departmentName}</div>
                    {bioBlocks.map((block: string, index: number) => (
                        <p key={index} className="mt-2 text-gray-700 text-lg">{block}</p>
                    ))}
                    <div className="mt-4 text-sm text-gray-500">資料更新日期: {updatedAt ? new Date(updatedAt).toLocaleDateString() : "無"}</div>
                </div>
            </div>
        </div>
    );
}


