import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
import { z } from "zod"

import { addHours } from "date-fns"

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: "未登入或無效的使用者" }), { status: 401 })
    }

    const postSchema = z.object({
        date: z.string().datetime(),
        slot: z.number()
    })

    try {
        const res = await req.json()
        const p = postSchema.safeParse(res)

        
        if (!p.success) {

            return new Response(JSON.stringify({ error: "無效的請求格式" }), { status: 400 })
        }

        const { slot } = p.data

        const date = addHours(new Date(p.data.date), slot)

        console.log("date", date)
        console.log("slot", slot)
        
        const doctor = await prisma.user.findUnique({
            where: {
                email: session.user.email || ""
            },
            include: {
                doctor: true
            }
        })

        if (!doctor || doctor.role !== "DOCTOR") {
            return new Response(JSON.stringify({ error: "無權限訪問" }), { status: 403 })
        }
        // get consulting room

        console.log(date, slot)

        const consultingRoom = await prisma.consultingRoom.findFirst({
            where: {
                doctorId: doctor.doctor?.id,
                day: date
            },
            include: {
                consultations: {
                    include: {
                        patient: true
                    }
                }
            }
        })

        if (!consultingRoom) {
            return NextResponse.json({
                patients: []
            })
        }

        return NextResponse.json({
            patients: consultingRoom.consultations
        })
    } catch (error) {
        console.error("Error fetching doctor schedule:", error)
        return new Response(JSON.stringify({ error: "伺服器錯誤" }), { status: 500 })
    }
}