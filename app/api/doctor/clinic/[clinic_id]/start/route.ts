import { NextResponse, NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export const GET = async (req: NextRequest, {
    params
}: {
    params: Promise<{
        clinic_id: string
    }>
}) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const p = (await params);

    console.log(p)

    const clinicId = p.clinic_id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user?.email || '',
                role: 'DOCTOR',
            },
            include: {
                doctor: true
            }
        })

        if (!user || !user.doctor) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }

        // find room and update status to IN_PROGRESS

        const room = await prisma.consultingRoom.update({
            where: {
                id: clinicId
            },
            data: {
                status: 'IN_PROGRESS',
            }
        })

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json({})

    } catch (error) {
        console.error('Error in GET /api/doctor/clinic/start:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}