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

        await prisma.consultation.update({
            where: { id },
            data: { appointmentStatus: "CANCELLED" },
        });

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Error in reservation cancellation:', error);
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }

}