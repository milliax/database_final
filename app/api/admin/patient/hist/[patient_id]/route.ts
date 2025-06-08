import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export const GET = async (request: NextRequest, {
    params
}: {
    params: Promise<{ patient_id: string }>
}) => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { patient_id } = await params;

        const user = await prisma.user.findUnique({
            where: {
                id: patient_id,
            },
            select: {
                doctor: {
                    select: {
                        id: true,
                    }
                }
            }

        });
        const consultation = await prisma.consultation.findMany({
            where: {
                patientId: user?.doctor?.id, // Assuming you want to fetch consultations for the patient's doctor
            },
            orderBy: {
                createdAt: 'desc', // Get the most recent consultation
            }, include: {
                patient: true,
                // doctor: true,
                Feedback: true,
                ConsultingRoom: {
                    include: {
                        doctor: {
                            include:{
                                user: true
                            }
                        }
                    }
                }
            }
        })

        console.log(consultation)

        return NextResponse.json(consultation, { status: 200 });

    } catch (error) {
        console.error('Error fetching patient history:', error);
        return NextResponse.json({ error: 'Failed to fetch patient history' }, { status: 500 });
    }
}