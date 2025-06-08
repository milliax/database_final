import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";



let currentNumber = 5; // 全域變數暫存




// 取得目前診間狀態
export const GET = async (req: NextRequest) => {
    return NextResponse.json({
        currentNumber: 5,
        currentPatient: {
            id: "p1",
            name: "王小明",
            description: " ",
            prescription: " "
        },
        queue: [
            { id: "p2", name: "李小華", number: 6 },
            { id: "p3", name: "陳大仁", number: 7 }
        ]
    });
};

// 叫下一號
export const POST = async (req: NextRequest) => {
    currentNumber += 1; // 叫下一號
    return NextResponse.json({ success: true, number_now: currentNumber });

    // const session = await getServerSession(authOptions);
    // if (!session || !session.user) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // // 取得醫生
    // const user = await prisma.user.findUnique({
    //     where: { email: session.user.email || "" },
    //     include: { doctor: true }
    // });
    // if (!user?.doctor) {
    //     return NextResponse.json({ error: "Not a doctor" }, { status: 403 });
    // }

    // // 取得今天的診間
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const room = await prisma.consultingRoom.findFirst({
    //     where: {
    //         doctorId: user.doctor.id,
    //         day: today,
    //     }
    // });

    // if (!room) {
    //     return NextResponse.json({ error: "No consulting room today" }, { status: 404 });
    // }

    // // 下一號
    // const nextNumber = room.number_now + 1;
    // if (nextNumber > room.max_consultation_number) {
    //     return NextResponse.json({ error: "No more patients" }, { status: 400 });
    // }

    // await prisma.consultingRoom.update({
    //     where: { id: room.id },
    //     data: { number_now: nextNumber }
    // });

    // return NextResponse.json({ success: true, number_now: nextNumber });
};