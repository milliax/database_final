import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"

export const GET = async (req: NextRequest, {
    params
}: {
    params: Promise<{
        clinic_id: string
    }>
}) => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clinicId = (await params).clinic_id

    try {

        await prisma.$transaction(async (tx) => {
            const room = await tx.consultingRoom.findUnique({
                where: {
                    id: clinicId
                }, include: {
                    consultations: {
                        orderBy: {
                            createdAt: 'asc'
                        },
                        include: {
                            patient: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    }
                }
            })

            if (!room) {
                throw new Error("Room not found")
            }

            console.log(room)

            let next_to_be_consulted: null | number = null
            let id_selected = null

            for (let i = 0; i < room.consultations.length; i++) {
                // for (const i in room.consultations) {
                if (room.consultations[i].consultingStatus === 'CHECKED_IN') {
                    next_to_be_consulted = i
                    id_selected = room.consultations[i].id
                }
            }

            // update consultation number to i+1

            if (next_to_be_consulted === null || id_selected === null) {
                throw new Error("No consultations found")
            }

            await tx.consultingRoom.update({
                where: {
                    id: clinicId
                },
                data: {
                    number_now: next_to_be_consulted + 1
                }
            })

            await tx.consultation.update({
                where: {
                    id: id_selected
                },
                data: {
                    consultingStatus: "IN_PROGRESS"
                }
            })
        })

        return NextResponse.json({ message: "Clinic updated successfully" }, { status: 200 })
    } catch (error) {

        const e = error as any

        if (e.hasOwnProperty('message')) {
            if (e.message === "Room not found") {
                return NextResponse.json({ error: "Room not found" }, { status: 404 })
            } else if (e.message === "No consultations found") {
                return NextResponse.json({ error: "No consultations found" }, { status: 404 })
            }
        }

        console.error("Error in GET /api/doctor/clinic/:clinic_id:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

}