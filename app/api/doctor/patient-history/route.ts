import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ history: [] }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    // 取得目前登入醫生
    const doctor = await prisma.user.findUnique({
        where: { email: session.user.email || "" },
        include: { doctor: true }
    });

    if (!doctor?.doctor) {
        return NextResponse.json({ history: [] }, { status: 403 });
    }

    // 查詢該病患在此醫生底下的所有看診紀錄
    const consultations = await prisma.consultation.findMany({
        where: {
            patientId: patientId || "",
            ConsultingRoom: {
                doctorId: doctor.doctor.id
            }
        },
        include: {
            Feedback: true
        },
        orderBy: { createdAt: "desc" }
    });

    const history = consultations.map(c => ({
        createdAt: c.createdAt,
        description: c.description,
        prescription: c.prescription,
        rating: c.Feedback[0]?.rating ?? null,
        comment: c.Feedback[0]?.comment ?? null,
    }));

    return NextResponse.json({ history });
};