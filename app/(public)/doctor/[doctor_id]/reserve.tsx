"use client"
import React, { useEffect, useState } from "react"

import CalendarMonth from "@/components/calendar/month_view"

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

    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [hoverDate, setHoverDate] = useState<number>(NaN);
    const [loading, setLoading] = useState<boolean>(false);
    const [daysWithEvent, setDaysWithEvent] = useState<Array<number>>([]); // TODO: add selectable days here
    // const [events, setEvents] = useState<Array<EventType>>(defaultData?.events ?? []);

    const [reload, setReload] = useState<boolean>(false);

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
    }

    useEffect(() => {
        fetchWorkingDays()
    }, [])

    return (
        <div className="w-full rounded-md bg-white border shadow-md px-3 py-1">
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
    )
}