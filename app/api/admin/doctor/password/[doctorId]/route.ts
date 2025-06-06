import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { z } from "zod"
import { prisma } from '@/lib/prisma';

import bcrypt from 'bcrypt'

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ doctorId: string }> }) => {
    const doctorId = (await params).doctorId;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updateSchema = z.object({
            password: z.string().min(6, '密碼至少六個字元'),
        });
        // verify the param_id
        const doc = await prisma.user.findUnique({
            where: { id: doctorId },
            include: { doctor: true },
        });

        if (!doc || doc.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Doctor not found or invalid role' }, { status: 404 });
        }

        // verify the request body
        const parsedData = updateSchema.safeParse(await request.json());
        if (!parsedData.success) {
            return NextResponse.json({ error: 'Invalid data format', issues: parsedData.error.issues }, { status: 400 });
        }

        const { password } = parsedData.data;
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatedDoctor = await prisma.user.update({
            where: { id: doctorId },
            data: {
                password: hashedPassword,
            },
        })

        return NextResponse.json(updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor:', error);
        return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
    }
}