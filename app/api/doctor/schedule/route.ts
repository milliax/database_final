<<<<<<< HEAD
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
=======
import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

export const GET = async (req: NextRequest) => {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: '未登入或無效的使用者' }), { status: 401 });
    }

    try {
        const doctorLoggedIn = await prisma.user.findUnique({
            where: {
                email: session.user.email || ''
            },
            include: {
                doctor: {
                    include: {
                        schedules: {
                            take: 1,
                            orderBy: {
                                createdAt: 'desc'
                            },
                        }
                    }
                }
            }
        });

        if (!doctorLoggedIn || doctorLoggedIn.role !== 'DOCTOR') {
            return new Response(JSON.stringify({ error: '無權限訪問' }), { status: 403 });
        }

        console.log(doctorLoggedIn)

        if (doctorLoggedIn.doctor?.schedules.length === 0) {
            return NextResponse.json({
                schedule: []
            })
        }

        return NextResponse.json({
            schedule: doctorLoggedIn.doctor?.schedules[0].slots
        });
    } catch (error) {
        console.error('Error fetching doctor schedule:', error);
        return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
    }

>>>>>>> ecd1135722e0959406a163d627e996012e8be94b
}