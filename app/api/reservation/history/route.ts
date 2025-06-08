import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ userName: "", reservations: [] });
        }

        // 取得目前登入的 user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                patient: {
                    include: {
                        consultations: {
                            where: {
                                appointmentStatus: { not: "CANCELLED" }
                            },
                            include: {
                                ConsultingRoom: {
                                    include: {
                                        doctor: {
                                            include: {
                                                user: true,
                                                department: true,
                                            },
                                        },
                                    },
                                },
                                Feedback: true, // 取得 feedback
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.patient) {
            return NextResponse.json({ userName: "", reservations: [] });
        }

        const userName = user.name || "";
        const reservations =
            (user.patient.consultations || [])
                .sort((a, b) => {
                    const dateA = a.ConsultingRoom?.day ? new Date(a.ConsultingRoom.day).getTime() : 0;
                    const dateB = b.ConsultingRoom?.day ? new Date(b.ConsultingRoom.day).getTime() : 0;

                    const slotA = a.ConsultingRoom?.slot || 0; // 0: 早, 1: 中, 2: 晚
                    const slotB = b.ConsultingRoom?.slot || 0;

                    // return dateB - dateA;
                    if (dateB !== dateA) {
                        return dateB - dateA; // 按日期降序排列
                    } else {
                        return slotA - slotB; // 如果日期相同，按時段降序排列
                    }
                })
                .map((c) => ({
                    id: c.id,
                    department: c.ConsultingRoom?.doctor?.department?.name || "",
                    doctor: c.ConsultingRoom?.doctor?.user?.name || "",
                    date: c.ConsultingRoom?.day
                        ? c.ConsultingRoom.day.toISOString().split("T")[0]
                        : "",
                    detail: c.description || "",
                    prescription: c.prescription || "", // <--- 新增這行
                    commented: (c.Feedback && c.Feedback.length > 0) ? true : false,
                    slot: c.ConsultingRoom?.slot || 0,
                    appointmentStatus: c.appointmentStatus || "", // 若有需要
                    feedback: c.Feedback && c.Feedback.length > 0 ? c.Feedback[0] : null, // 取得最新的 feedback
                }));

        return NextResponse.json({ userName, reservations });
    } catch (error) {
        console.error("Error fetching reservation history:", error);
        return NextResponse.json({ userName: "", reservations: [], error: "Failed to fetch reservation history" }, { status: 500 });
    }
}