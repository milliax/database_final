"use client"
import { LoadingCircle } from "@/components/loading";
import { numberInLetter } from "@/lib/utils";
import React, { useState, useEffect } from "react";

export default function DoctorClinicPage() {
    // const clinicRooms = [
    //     { roomId: 1, slot: 1, date: "2024-01-01" },
    //     { roomId: 2, slot: 0, date: "2024-01-02" },
    //     { roomId: 3, slot: 2, date: "2024-01-03" },
    //     { roomId: 4, slot: 2, date: "2024-01-04" },
    //     { roomId: 5, slot: 0, date: "2024-01-05" },
    // ];

    const [currentDate, setCurrentDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [clinicRooms, setClinicRooms] = useState<any[]>([]);

    const fetchClinicRooms = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/clinic/rooms");

            if (!res.ok) {
                throw new Error("Failed to fetch clinic rooms");
            }

            const data = await res.json();
            setClinicRooms(data);
            console.log(data)
        } catch (error) {
            console.error("Error fetching clinic rooms:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("zh-TW", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        setCurrentDate(formattedDate);

        // fetch clinic rooms
        fetchClinicRooms()
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className="text-center h-40">
                <h1>Upcoming Clinic Rooms</h1>
                <p>今天日期: {currentDate}</p>
            </div>
            <div className="flex gap-2 px-5 flex-row items-center justify-between max-w-7xl min-h-[calc(100vh-20rem)]">
                {loading ? (
                    <div className="flex items-center h-40 ">
                        <LoadingCircle />
                    </div>
                ) : (
                    <React.Fragment>
                        {clinicRooms.map((room) => (
                            <div
                                key={room.id}
                                className="flex flex-col text-center border border-gray-300 rounded-lg shadow-lg p-4 h-80 justify-between"
                            >
                                <div className="h-2/5 flex flex-col justify-between">
                                    <h3>{room.roomId}</h3>
                                    <p>門診日期: {Math.floor(room.slot / 7) === 0 ? "7:00 ~ 11:00" : (Math.floor(room.slot / 7) === 1 ? "13:00 ~ 17:00" : "18:00 ~ 22:00")}</p>
                                    <p>門診時間: {new Date(room.day).toLocaleDateString()}</p>
                                    <p>星期: {numberInLetter(((new Date(room.day).getDay()) + 6) % 7)}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {room.status === "COMPLETED" &&
                                        <button
                                            className="px-4 py-2 rounded bg-red-500 text-white transition-colors cursor-not-allowed"
                                        // onClick={() => window.location.href = `/doctor/clinic/${room.id}`}
                                        >
                                            已看完ㄌ
                                        </button>
                                    }
                                    <button
                                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
                                        onClick={() => window.location.href = `/doctor/clinic/${room.id}`}
                                    >
                                        開始看診
                                    </button>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                )}
            </div>

        </div>
    );
}