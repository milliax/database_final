import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postSchema = z.object({
        id: z.string(),
    });

    try {
        const p = postSchema.safeParse(await req.json());
        if (!p.success) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        const { id } = p.data;

        console.log(`reservation id: `, id)

        const res = await prisma.consultation.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({})
    } catch (error) {
        console.error('Error in reservation cancellation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}