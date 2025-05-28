"use client"

import { useEffect, useState } from "react";

export default function DoctorSummaryPage() {
    const [doctorData, setDoctorData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 這裡請替換成實際 API 路徑
        fetch("/api/doctors")
            .then((res) => res.json())
            .then((data) => {
                setDoctorData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("API 請求失敗:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>載入中...</p>;

    return (
        <div>
            <h1>Summary</h1>
            <p>Doctor This is the summary page.</p>
            {doctorData && (
                <div>
                    <h2>醫生資訊</h2>
                    {doctorData.map(d => (
                        <div key={d.id}>
                            {d.name}
                            <img src={d.image}/>
                        </div>
                    ))}
                    {/* <pre>{JSON.stringify(doctorData, null, 2)}</pre> */}
                </div>
            )}
        </div>
    );
}

