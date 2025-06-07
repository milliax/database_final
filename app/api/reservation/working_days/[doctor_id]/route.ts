import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const GET = async (req: NextRequest, { params }: { params: Promise<{ doctor_id: string }> }) => {
    const { doctor_id } = await params;

    try {
        // Fetch working days for the doctor
        const schedule = await prisma.schedule.findFirst({
            where: {
                doctorId: doctor_id,
            },
            select: {
                slots: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 1, // Get the most recent schedule
        })

        if (!schedule || !schedule.slots) {
            return NextResponse.json({ error: "No working days found for this doctor" }, { status: 404 });
        }

        return NextResponse.json({
            schedule
        });
    } catch (error) {
        console.error("Error fetching working days:", error);
        return NextResponse.json({ error: "Failed to fetch working days" }, { status: 500 });
    }
}