import { NextRequest, NextResponse } from 'next/server';

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

    const clinicId = (await params).clinic_id;

    try {

        const room = await prisma.consultingRoom.findUnique({
            where: {
                id: clinicId
            },
            include: {
                consultations: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        return NextResponse.json(room || { error: 'Room not found' }, { status: room ? 200 : 404 });

    } catch (error) {
        console.error('Error in GET /api/doctor/clinic/:clinic_id:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}