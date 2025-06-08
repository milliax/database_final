"use client"
import React, { useEffect, useState } from "react"

import CalendarMonth from "@/components/calendar/month_view"
import clsx from "clsx";
import Swal from "sweetalert2";

import { useRouter } from "next/navigation";

interface DateTime {
    year?: number;
    month?: number;
    day?: number;
}

export default function DoctorReservePage({
    doctor_id
}: {
    doctor_id: string;
}) {
    const today = new Date();

    const [reserve, setReserve] = useState<boolean>(false);

    const [schedule, setSchedule] = useState<number[]>([]);

    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [hoverDate, setHoverDate] = useState<number>(NaN);
    const [loading, setLoading] = useState<boolean>(true);
    const [daysWithEvent, setDaysWithEvent] = useState<Array<number>>([]); // TODO: add selectable days here
    // const [events, setEvents] = useState<Array<EventType>>(defaultData?.events ?? []);

    const [timeSelected, setTimeSelected] = useState<string>("");

    const [reload, setReload] = useState<boolean>(false);

    const router = useRouter();

    const toggleMonth = (val: 1 | -1) => {
        const month = selectedMonth;

        if (month + val > 12) {
            setSelectedMonth(1);
            setSelectedYear(e => e + 1);
        } else if (month + val < 1) {
            setSelectedMonth(12);
            setSelectedYear(e => e - 1);
        } else {
            setSelectedMonth(month + val);
        }
        setSelectedDay(NaN)
    }

    const fetchWorkingDays = async () => {
        const res = await fetch(`/api/reservation/working_days/${doctor_id}`)
        if (!res.ok) {
            console.error("Failed to fetch working days");
            return;
        }
        const data = await res.json();

        console.log(data.schedule.slots)

        setSchedule(data.schedule.slots);
        updateDateWithEvent(data.schedule.slots);
    }

    const updateDateWithEvent = (slot?: number[]) => {
        // week 1 to 7
        let s = slot || schedule

        let availableDays: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < s.length; i++) {
            if (s[i]) {
                availableDays[i % 7] = 1;
            }
        }

        let temp = availableDays[6]
        for (let i = 6; i > 0; i--) {
            availableDays[i] = availableDays[i - 1];
        }
        availableDays[0] = temp; // 右移availableDays

        // 右移availableDays
        console.log("Available Days: ", availableDays);

        // get the first day of the month
        const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
        const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Calculate the number of days in the month
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

        // Create an array to hold the days with events
        let daysWithEvents: number[] = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dayOfWeek = (firstDayOfWeek + i - 1) % 7; // Calculate the day of the week for the current day
            if (availableDays[dayOfWeek] === 1) {
                daysWithEvents.push(i);
            }
        }
        setDaysWithEvent(daysWithEvents);
        setLoading(false);
    }

    useEffect(() => {
        updateDateWithEvent()
    }, [selectedMonth, selectedYear])

    useEffect(() => {
        fetchWorkingDays()
    }, [])

    const reserveNow = async () => {
        const res = await fetch(`/api/reservation`, {
            method: "POST",
            body: JSON.stringify({
                doctor_id,
                date: new Date(selectedYear, selectedMonth - 1, selectedDay).toISOString(),
                time: timeSelected === "早" ? 0 : timeSelected === "中" ? 1 : timeSelected === "晚" ? 2 : -1,
            }),
        })
        const result = await res.json();
        if (!res.ok) {
            console.error("Failed to reserve");

            console.error(result);

            Swal.fire({
                title: "預約失敗",
                text: result.error || "請稍後再試",
                icon: "error",
                confirmButtonText: "確定",
            });

            return;
        }

        Swal.fire({
            title: "預約成功",
            text: `您已成功預約 ${new Date(selectedYear, selectedMonth - 1, selectedDay).toLocaleDateString()} ${timeSelected} 時段`,
            icon: "success",
            confirmButtonText: "確定",
        }).then(() => {
            setReserve(false);
            setSelectedDay(NaN);
            setTimeSelected("");
            setReload(e => !e);

            router.push(`/reservation/history`);
        });
    }

    return (
        <div className="w-full rounded-md bg-white border shadow-md px-3 py-1 flex md:flex-row items-center flex-col gap-5">
            <div className="w-full">
                <CalendarMonth
                    calendarName="Hello"
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    hoverDate={hoverDate}
                    setHoverDate={setHoverDate}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    rentedDays={daysWithEvent}
                    loading={loading}
                    toggleMonth={toggleMonth}
                    setReserve={setReserve}
                />
            </div>

            <div className="w-full flex items-center justify-center max-w-xs">
                <div className="flex flex-col items-center max-h-40 h-screen w-40 justify-between gap-1">
                    <button className={clsx("bg-indigo-400 hover:bg-indigo-500 w-full h-full flex items-center justify-center cursor-pointer text-white",
                        timeSelected === "早" ? "bg-indigo-500 " : "",
                        schedule[(new Date(selectedYear, selectedMonth - 1, selectedDay - 1).getDay())] === 1 ?
                            (timeSelected === "早" ? "ring-4 ring-black rounded-md" : "") : "opacity-50 cursor-not-allowed"
                    )} onClick={() => {
                        setTimeSelected("早");
                    }}>早</button>
                    <button className={clsx("bg-indigo-400 hover:bg-indigo-500 w-full h-full flex items-center justify-center cursor-pointer text-white",
                        timeSelected === "中" ? "bg-indigo-500" : "",
                        schedule[(new Date(selectedYear, selectedMonth - 1, selectedDay - 1).getDay()) + 7] === 1 ?
                            (timeSelected === "中" ? "ring-4 ring-black rounded-md" : "") : "opacity-50 cursor-not-allowed"
                    )} onClick={() => {
                        setTimeSelected("中");
                    }}>中</button>
                    <button className={clsx("bg-indigo-400 hover:bg-indigo-500 w-full h-full flex items-center justify-center cursor-pointer text-white",
                        timeSelected === "晚" ? "bg-indigo-500" : "",
                        schedule[(new Date(selectedYear, selectedMonth - 1, selectedDay - 1).getDay()) + 14] === 1 ?
                            (timeSelected === "晚" ? "ring-4 ring-black rounded-md" : "") : "opacity-50 cursor-not-allowed"
                    )} onClick={() => {
                        setTimeSelected("晚");
                    }}>晚</button>
                </div>
            </div>

            <div>
                <button className="bg-blue-500 w-20 h-12 text-white rounded-md hover:bg-blue-600 cursor-pointer" onClick={() => {
                    reserveNow()
                }}> 預約 </button>
            </div>
        </div>
    )
}