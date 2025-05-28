"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


type Doctor = {
  id: number;
  name: string;
  department: string;
  image: string;
};

export default function DoctorSummaryPage() {
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return <p className="text-center py-10">載入中...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-green-700">醫師總覽</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctorData.map((doctor) => (
          <div
            key={doctor.id}
            className="flex items-center gap-4 p-4 border rounded shadow bg-white"
          >
            <Image
              src={doctor.image}
              alt={doctor.name}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-lg">{doctor.name}</p>
              <p className="text-sm text-gray-600">{doctor.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
