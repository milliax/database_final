import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

import { z } from "zod"

export const GET = async (req: NextRequest, { params }: { params: Promise<{ doctorId: string }> }) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.role || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const doctorId = await params;

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId.doctorId },
            select: {
                schedules: {
                    take: 2,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        
        console.log(doctor?.schedules)

        return NextResponse.json(doctor);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
    }
}

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ doctorId: string }> }) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.role || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { doctorId } = await params;
    const body = await req.json();

    const putSchema = z.object({
        schedule: z.array(z.boolean()).length(21)
    });

    try {
        const updatedDoctor = await prisma.doctor.update({
            where: { id: doctorId },
            data: body,
        });

        return NextResponse.json(updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor schedule:', error);
        return NextResponse.json({ error: 'Failed to update doctor schedule' }, { status: 500 });
    }
}