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

                const b = d.doctor.bio || "";

                const blocks = b.split("\n").filter((block: any) => block.trim() !== "");

                return (
                    <div key={d.id} className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-40 h-40 relative rounded-full overflow-hidden border border-gray-300">
                                <Image src={d.image || "/images/default-doctor.jpg"} alt={d.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-green-800">主治醫師：{d.name}</h2>
                                {blocks.map((block: any, index: number) => {
                                    if(block.startsWith("(") && block.endsWith(")")) {
                                        return (
                                            <h3 key={index} className="mt-2 text-black text-2xl">
                                                {block.slice(1, -1)}
                                            </h3>
                                        );
                                    }
                                    return (
                                        <p key={index} className="mt-2 text-gray-700 text-lg">
                                            {block}
                                        </p>
                                    );
                                })}
                                <div className="mt-4 flex justify-end">
                                    <Link
                                        href={`/doctor/${d.id}`}
                                        className="text-xl px-6 py-2 rounded-full bg-yellow-400 text-black hover:bg-green-800 hover:text-white transition hover:scale-110 duration-75"
                                    >
                                        我要預約
                                    </Link>
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


