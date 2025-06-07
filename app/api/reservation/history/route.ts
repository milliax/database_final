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
                    return dateB - dateA;
                })
                .map((c) => ({
                    id: c.id,
                    department: c.ConsultingRoom?.doctor?.department?.name || "",
                    doctor: c.ConsultingRoom?.doctor?.user?.name || "",
                    date: c.ConsultingRoom?.day
                        ? c.ConsultingRoom.day.toISOString().split("T")[0]
                        : "",
                    detail: c.description || "",
                    commented: (c.Feedback && c.Feedback.length > 0) ? true : false,
                }));

        return NextResponse.json({ userName, reservations });
    } catch (error) {
        console.error("Error fetching reservation history:", error);
        return NextResponse.json({ userName: "", reservations: [], error: "Failed to fetch reservation history" }, { status: 500 });
    }
}