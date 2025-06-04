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

        const user = await prisma.user.findUnique({
            where: { id: doctorId.doctorId },
            select: {
                doctor: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!user || !user.doctor) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }

        const doctor = await prisma.doctor.findUnique({
            where: { id: user.doctor.id },
            select: {
                schedules: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        console.log(doctor?.schedules)

        return NextResponse.json(doctor?.schedules?.[0]?.slots || null);
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

    const putSchema = z.object({
        schedule: z.array(z.number()).length(21)
    });

    try {
        const user = await prisma.user.findUnique({
            where: { id: doctorId },
            select: {
                doctor: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!user || !user.doctor) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }

        const body = await req.json();
        const parsedBody = putSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const schedule = parsedBody.data.schedule;

        console.log(schedule)

        const s = await prisma.schedule.create({
            data: {
                doctorId: user.doctor.id,

                slots: schedule.map((isAvailable, index) => (isAvailable ? 1 : 0)),
                startTime: new Date()
            }
        })

        return NextResponse.json({ success: true, message: 'Schedule updated successfully' });
    } catch (error) {
        console.error('Error updating doctor schedule:', error);
        return NextResponse.json({ error: 'Failed to update doctor schedule' }, { status: 500 });
    }
}