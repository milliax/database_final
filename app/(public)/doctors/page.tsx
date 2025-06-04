"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
            {doctorData.map((d) => {
                console.log(d.doctor.bio)
                if (!d.doctor || !d.doctor.bio) {
                    // 沒有bio
                    return <div key={d.id} className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-40 h-40 relative rounded-full overflow-hidden border border-gray-300">
                                <Image src={d.image || "/images/default-doctor.jpg"} alt={d.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-green-800">主治醫師：{d.name}（內科部主任）</h2>
                                <div className="mt-4">
                                    <Link href="/doctor" className="text-blue-600 hover:underline">門診時間</Link>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">資料更新日期: {new Date(d.updatedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                }

                const matches = [...d.doctor.bio.matchAll(/\((.*?)\)/gm)];
                const result = matches.map(match => {
                    const [first, second = ""] = match[1].split(/,(.*)/gm).slice(0, 2);
                    return [first, second];
                });

                console.log("result", result);

                return (
                    <div key={d.id} className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-40 h-40 relative rounded-full overflow-hidden border border-gray-300">
                                <Image src={d.image || "/images/default-doctor.jpg"} alt={d.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-green-800">主治醫師：{d.name}</h2>
                                {result.length > 0 && result.map((a: any[], idx) => (
                                    <div key={idx}>
                                        <h3 className="text-xl py-2 text-black font-semibold">
                                            {a[0]}
                                        </h3>
                                        <div>
                                            {/* {"12.213.23.4243.".split(".").map((item: string, index: number) => ( */}
                                            {a[1].split(".").map((item: string, index: number) => (
                                                <div key={index} className="text-lg text-gray-600">
                                                    {item.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4">
                                    <Link href={`/doctor/${d.id}`} className="text-blue-600 hover:underline">門診時間</Link>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">資料更新日期: {new Date(d.updatedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}


