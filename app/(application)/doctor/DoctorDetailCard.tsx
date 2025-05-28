"use client";
import { useEffect, useState } from "react";

export default function DoctorDetailCard() {
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    fetch("/api/doctors/1") // 如果你的 API 是多筆，用 /api/doctors/1
      .then((res) => res.json())
      .then((data) => setDoctor(data));
  }, []);

  if (!doctor) return <p>載入中...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 border-2 border-green-500 rounded-md bg-white shadow-sm text-gray-800 relative">
      <h1 className="text-center text-2xl font-bold text-green-600 mb-4">
        {doctor.department}
      </h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-40 h-40 object-cover rounded-full border"
        />

        <div className="flex-1">
          <h2 className="bg-green-600 text-white text-center font-bold py-2 px-4 rounded mb-4 inline-block">
            科主任：{doctor.name}（{doctor.title}）
          </h2>

          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-1">現職：</h3>
            <ul className="list-disc pl-6 text-sm">
              {doctor.currentPositions.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-1">醫務專長：</h3>
            <ul className="list-disc pl-6 text-sm">
              {doctor.specialties.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {doctor.clinicUrl && (
            <a
              href={doctor.clinicUrl}
              className="text-blue-600 underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              門診時間
            </a>
          )}
        </div>
      </div>

      <div className="flex justify-end items-center mt-6 text-sm">
        <span className="mr-4 text-gray-500">資料更新日期：2025/4/11</span>
        <button className="border px-4 py-1 rounded hover:bg-gray-100 transition">
          詳細介紹
        </button>
      </div>
    </div>
  );
}
