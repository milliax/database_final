import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { id } = await req.json();
    try {
        await prisma.consultation.update({
            where: { id },
            data: { appointmentStatus: "CANCELLED" },
        });
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }
}