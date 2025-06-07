import { NextResponse, NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const doctors = await prisma.user.findMany({
            where: {
                role: 'DOCTOR',
            },
            include: {
                doctor: true
            },
            orderBy: {
                createdAt: 'asc',
            }
        });

        return NextResponse.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
    }
}