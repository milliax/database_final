"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function DoctorSummaryPage() {
    const [doctorData, setDoctorData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/doctors")
            .then((res) => res.json())
            .then((data) => {
                setDoctorData(data);
                setLoading(false);
                console.log(data)
            })
            .catch((error) => {
                console.error("API 請求失敗:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center mt-10">載入中...</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center text-green-700 mb-6">內科部</h1>
            {doctorData.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-40 h-40 relative rounded-full overflow-hidden border border-gray-300">
                            <Image src={d.image || "/images/default-doctor.jpg"} alt={d.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-green-800">主治醫師：{d.name}（內科部主任）</h2>
                            <div className="mt-4 space-y-1 text-gray-700">
                                <p>國泰綜合醫院內科部主任</p>
                                <p>國泰綜合醫院呼吸胸腔科主任</p>
                                <p>國泰綜合醫院呼吸胸腔科主治醫師</p>
                                <p>教育部部定講師</p>
                                <p>國立清華大學合聘講師</p>
                            </div>
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-800">醫務專長：</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    {d.doctor.bio}
                                </ul>
                            </div>
                            <div className="mt-4">
                                <a href="/doctor" className="text-blue-600 hover:underline">門診時間</a>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">資料更新日期: 2025/4/16</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


