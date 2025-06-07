
import { prisma } from "@/lib/prisma";
import Image from "next/image";

import ReservePart from "./reserve";

export default async function DoctorDetailPage({
    params,
}: {
    params: Promise<{ doctor_id: string }>;
}) {
    const doctor_id = (await params).doctor_id;

    const doctor = await prisma.doctor.findUnique({
        where: {
            id: doctor_id,
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                }
            },
            department: true
        },
    });

    console.log(doctor)

    if (!doctor) return <p className="text-center mt-10">找不到醫生資料</p>;

    // 取出詳細資料
    const bioBlocks = (doctor?.bio || "").split("\n").filter((block: string) => block.trim() !== "");
    const departmentName = doctor?.department?.name || "未指定";
    const updatedAt = doctor?.updatedAt || doctor.updatedAt;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-5">
            <h1 className="text-3xl font-bold text-center text-green-700 mb-6">醫生詳細資訊</h1>
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-200 flex flex-col md:flex-row items-center gap-6">
                <div className="w-80 aspect-square relative rounded-lg overflow-hidden border border-gray-300">
                    <Image src={doctor.user.image || "/images/default-doctor.jpg"} alt={doctor.user.name ?? ""} fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-green-800">主治醫師：{doctor.user.name}</h2>
                    <div className="mt-2 text-gray-600 text-lg">科別：{departmentName}</div>
                    {bioBlocks.map((block: string, index: number) => (
                        <p key={index} className="mt-2 text-gray-700 text-lg">{block}</p>
                    ))}
                    <div className="mt-4 text-sm text-gray-500">資料更新日期: {updatedAt ? new Date(updatedAt).toLocaleDateString() : "無"}</div>
                </div>
            </div>
            <ReservePart doctor_id={doctor_id}/>
        </div>
    );
}


