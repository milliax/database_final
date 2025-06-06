import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export const GET = async (request: NextRequest, { params }: { params: Promise<{ name: string }> }) => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patientName = (await params).name;

    try {
        const patient = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: patientName,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },{
                        patient: {
                            id_card_number: {
                                contains: patientName,
                                mode: 'insensitive', // Case-insensitive search
                            }
                        }
                    }
                ],
                role: 'PATIENT',
            },
            select: {
                id: true,
                name: true,

                patient: {
                    select: {
                        id_card_number: true,
                        consultations:{
                            take:1,
                            orderBy: {
                                createdAt: 'desc', // Get the most recent consultation
                            },
                            select: {
                                createdAt: true,
                            }
                        }
                    },
                },
            }
        });

        console.log('Fetched patient:')
        console.log(patient);

        return NextResponse.json(patient, { status: 200 });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
    }
}

import { z } from 'zod';