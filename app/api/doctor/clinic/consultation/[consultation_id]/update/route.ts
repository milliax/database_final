import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { z } from 'zod';

export const POST = async (req: NextRequest, {
    params
}: {
    params: Promise<{
        consultation_id: string
    }>
}) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const consultationId = (await params).consultation_id;

    const postSchema = z.object({
        prescription: z.string().min(1, 'Prescription is required'),
        description: z.string().min(1, 'Description is required')
    });

    try {
        const body = await req.json();
        const parsedBody = postSchema.safeParse(body);
        if (!parsedBody.success) {

            // return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
            // return error with details
            return NextResponse.json({ error: parsedBody.error.errors }, { status: 400 });
        }

        const { prescription, description } = parsedBody.data;

        const consultation = await prisma.consultation.update({
            where: {
                id: consultationId
            }, data: {
                consultingStatus: "COMPLETED",

                prescription,
                description
            }
        });

        if (!consultation) {
            return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
        }

        return NextResponse.json(consultation, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/doctor/clinic/:consultation_id:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}