import { NextResponse, NextRequest } from 'next/server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

export const GET = async (req: NextRequest, {
    params
}: {
    params: Promise<{
        consultation_id: string;
    }>
}) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { consultation_id } = await params;

    try {
        const consultation = await prisma.consultation.findUnique({
            where: {
                id: consultation_id,
            },
        });

        if (!consultation) {
            return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
        }

        return NextResponse.json(consultation, { status: 200 });
    } catch (error) {
        console.error('Error processing prescription:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}