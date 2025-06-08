import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'

export const GET = async (req: NextRequest, {
    params
}: {
    params: Promise<{
        consultation_id: string
    }>
}) => {

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const consultationId = (await params).consultation_id

    try {
        const consultation = await prisma.consultation.update({
            where: {
                id: consultationId
            },
            data: {
                consultingStatus: 'CHECKED_IN',
            }
        })

        if (!consultation) {
            return NextResponse.json({ error: "Consultation not found" }, { status: 404 })
        }

        return NextResponse.json(consultation, { status: 200 })
    } catch (error) {
        console.error('Error in GET /api/doctor/clinic/[consultation_id]/check_in:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}