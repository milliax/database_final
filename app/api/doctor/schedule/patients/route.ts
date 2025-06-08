import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
import { z } from "zod"

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: "未登入或無效的使用者" }), { status: 401 })
    }


    const postSchema = z.object({
        date: z.string().datetime(),
    })

    try{
        const { date } = postSchema.parse(await req.json())

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

        const consultingRoom = await prisma.consultingRoom.findFirst({
            where: {
                doctorId: doctor.doctor?.id,
                day: date
            },
            include:{
                consultations:{
                    include:{
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
    }catch (error) {
    }
}