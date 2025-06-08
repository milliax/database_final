import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const weekStartStr = searchParams.get("weekStart");

    if (!doctorId || !weekStartStr) {
        return NextResponse.json({ error: "缺少 doctorId 或 weekStart" }, { status: 400 });
    }

    // 查醫生姓名（和 /api/doctors/route.ts 一樣 include user）
    const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: { user: { select: { name: true } } }
    });
    if (!doctor) {
        return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    const doctorName = doctor.user?.name || "";

    // 算出本週 7 天
    const weekStart = new Date(weekStartStr);
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        d.setHours(0, 0, 0, 0);
        weekDays.push(d);
    }

    // 查詢本週所有 ConsultingRoom（班表 slot）
    const consultingRooms = await prisma.consultingRoom.findMany({
        where: {
            doctorId,
            day: {
                gte: weekDays[0],
                lte: weekDays[6],
            },
        },
        select: {
            day: true,
            slot: true,
        },
    });

    // 建立 3x7 的二維陣列，預設 null
    const schedules: (string | null)[][] = Array(3).fill(null).map(() => Array(7).fill(null));
    consultingRooms.forEach(room => {
        const dayIdx = (new Date(room.day)).getDay();
        schedules[room.slot][dayIdx] = doctorName;
    });

    return NextResponse.json({ schedules });
}