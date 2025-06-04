import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export const GET = async (request: NextRequest, { params }: { params: Promise<{ doctor_id: string }> }) => {
    const doctorId = (await params).doctor_id;

    try {
        const doctor = await prisma.user.findUnique({
            where: { id: doctorId },
            include: {
                doctor: {
                    include: {
                        department: true,
                    },
                }
            },
        });

        if (!doctor) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }

        return NextResponse.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
    }
}

import { z } from 'zod';

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ doctor_id: string }> }) => {
    const doctorId = (await params).doctor_id;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updateSchema = z.object({
            name: z.string().min(1, '姓名至少一個字'),
            bio: z.string().min(1, '自我介紹至少一個字'),
            department: z.string().min(1, '部門至少一個字'),
            image: z.string().min(1, '照片連結至少一個字元長'),
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

        const { name, bio, department, image } = parsedData.data;

        const updatedDoctor = await prisma.user.update({
            where: { id: doctorId },
            data: {
                name,
                doctor: {
                    update: {
                        bio,
                        department: {
                            connectOrCreate: {
                                where: { name: department },
                                create: { name: department },
                            },
                        },
                    },
                },
                image,
            },
        })

        return NextResponse.json(updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor:', error);
        return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
    }
};