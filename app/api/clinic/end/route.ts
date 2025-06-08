import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    // 取得今天日期（不含時間）
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 判斷目前時段 slot
    const hour = now.getHours();
    let slot = -1;
    if (hour >= 7 && hour < 11) slot = 0;      // 早班
    else if (hour >= 13 && hour < 17) slot = 1; // 午班
    else if (hour >= 18 && hour < 22) slot = 2; // 晚班

    if (slot === -1) {
        return NextResponse.json({ error: "非看診時段" }, { status: 400 });
    }

    // 找出今天這個時段所有 ConsultingRoom
    const rooms = await prisma.consultingRoom.findMany({
        where: {
            day: today,
            slot: slot,
        },
        select: { id: true }
    });

    const roomIds = rooms.map(r => r.id);

    // 將所有這些 ConsultingRoom 下狀態為 PENDING 或 CHECKED_IN 的 Consultation 標記為 NO_SHOW
    await prisma.consultation.updateMany({
        where: {
            consultingRoomId: { in: roomIds },
            consultingStatus: { in: ["PENDING", "CHECKED_IN"] }
        },
        data: {
            consultingStatus: "NO_SHOW",
            appointmentStatus: "NO_SHOW"
        }
    });

    return NextResponse.json({ ok: true });
}