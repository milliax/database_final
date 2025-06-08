import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { consultationId, description, prescription } = await req.json();

    // 更新病歷
    await prisma.consultation.update({
        where: { id: consultationId },
        data: {
            description,
            prescription,
            consultingStatus: "COMPLETED"
        }
    });

    return NextResponse.json({ success: true });
};