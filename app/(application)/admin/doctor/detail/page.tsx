"use client"

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminSchedulePage() {
    const [doctor, setDoctor] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");

    const fetchDoctors = async () => {
        const res = await fetch('/api/admin/doctor/fetch_all')
        if (!res.ok) {
            throw new Error('Failed to fetch doctors');
        }
        const data = await res.json();
        console.log(data);
        setDoctor(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchDoctors()
    }, [])

    return (
        <div className="flex flex-col items-center  bg-gray-50">
            <h1 className="text-2xl font-bold text-center my-8">醫生簡介變更</h1>
            <section className="flex flex-row w-[60rem]">
                <nav className="flex flex-col rounded-md bg-white shadow-md">
                    {doctor.map((d) => (
                        <div key={d.id} className="p-4 border-b hover:bg-gray-50 cursor-pointer select-none" onClick={() => {
                            setSelectedDoctor(d.id);
                            console.log("Selected Doctor ID:", d.id);
                        }}>
                            <img src={d.image || "/images/default-doctor.jpg"}
                                alt={d.name}
                                className="w-16 h-16 rounded-full mb-2" />
                            <h2 className="text-lg font-semibold">{d.name}</h2>
                            <p className="text-sm text-gray-600">{d.department}</p>
                        </div>
                    ))}
                </nav>

                <div className="w-full min-h-60">
                    <EditDoctorForm doctorId={selectedDoctor} />
                    {/* <textarea className="w-full h-full p-4 border rounded-md bg-white shadow-md"
                        placeholder="請在此輸入醫生簡介..."
                        value={selectedDoctor ? doctor.find(d => d.id === selectedDoctor)?.description || '' : ''}
                        onChange={(e) => {
                            const updatedDoctor = doctor.map(d =>
                                d.id === selectedDoctor ? { ...d, description: e.target.value } : d
                            );
                            setDoctor(updatedDoctor);
                        }}
                    /> */}
                </div>
            </section>
        </div>
    );
}


const EditDoctorForm = ({
    doctorId
}: {
    doctorId: string
}) => {
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [bio, setBio] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");

    const sendData = async () => {
        const res = await fetch(`/api/admin/doctor/${doctorId}`, {
            method: 'PUT',
            body: JSON.stringify({
                bio,
                department,
                name,
                image: imageURL,
            })
        })
        const data = await res.json();
        if (!res.ok) {
            const issue = data.issues ? data.issues[0].message : '未知錯誤';
            Swal.fire({
                icon: 'error',
                title: '更新失敗',
                text: issue || '請稍後再試',
            });
            throw new Error('Failed to update doctor');
        }
        Swal.fire({
            icon: 'success',
            title: '更新成功',
            text: '醫生簡介已成功更新',
        });
        console.log("Updated doctor data:", data);
    }

    useEffect(() => {
        if (doctorId) {
            const fetchDoctor = async () => {
                setLoading(true);
                const res = await fetch(`/api/admin/doctor/${doctorId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch doctor');
                }
                const data = await res.json();
                setDoctor(data);
                console.log(data)

                setBio(data.doctor.bio || "");
                setName(data.name || "");
                setDepartment(data.doctor.department || "");
                setImageURL(data.image || "");

                setLoading(false);
            };

            fetchDoctor();
        } else {
            setDoctor(null);
        }
    }, [doctorId]);

    return (
        <div className="p-4 bg-white shadow-md rounded-md w-full max-w-md mx-auto">
            {doctorId ? (
                <form className="flex flex-col space-y-4" onSubmit={(event) => {
                    event.preventDefault();
                    sendData()
                }}>
                    <div className="flex flex-row gap-3 items-center">
                        <label className="block text-sm font-medium text-gray-700 w-12">姓名</label>
                        <input
                            type="text"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={name || ""}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row gap-3 items-center">
                        <label className="block text-sm font-medium text-gray-700 w-12">部門</label>
                        <input
                            type="text"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={department || ""}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row gap-3 items-center">
                        <label className="block text-sm font-medium text-gray-700 w-12">個人經歷</label>
                        <textarea
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                            value={bio || ""}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                        onClick={() => {
                            console.log("Submitting data for doctor ID:", doctorId);
                        }}
                    >
                        更新醫生簡介
                    </button>
                </form>
            ) : (
                <p className="text-gray-500 text-center">請選擇一位醫生以編輯其簡介</p>
            )}
        </div>
    )
}