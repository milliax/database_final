import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export  const GET = async (req: NextRequest, {
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

    const clinicId = (await params).clinic_id;

    try {
        const room = await prisma.consultingRoom.update({
            where:{
                id: clinicId
            },
            data:{
                status: "COMPLETED"
            },
            include:{
                consultations: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        // iterate all consultations in the room and update their to NO_SHOW if not completed

        for(const consultation of room.consultations) {
            if (consultation.consultingStatus === 'PENDING') {
                await prisma.consultation.update({
                    where: {
                        id: consultation.id
                    },
                    data: {
                        consultingStatus: 'NO_SHOW'
                    }
                });
            }
        }

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json(room, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/doctor/clinic/:clinic_id:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}