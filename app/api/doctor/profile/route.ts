import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ error: "缺少 userId" }, { status: 400 });
    }
    const doctor = await prisma.doctor.findUnique({
        where: { userId },
        select: { id: true }
    });
    if (!doctor) {
        return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json({ doctorId: doctor.id });
}