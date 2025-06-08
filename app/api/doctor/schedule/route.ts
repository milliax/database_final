import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

export const GET = async (req: NextRequest) => {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: '未登入或無效的使用者' }), { status: 401 });
    }

    try {
        const doctorLoggedIn = await prisma.user.findUnique({
            where: {
                email: session.user.email || ''
            },
            include: {
                doctor: {
                    include: {
                        schedules: {
                            take: 1,
                            orderBy: {
                                createdAt: 'desc'
                            },
                        }
                    }
                }
            }
        });

        if (!doctorLoggedIn || doctorLoggedIn.role !== 'DOCTOR') {
            return new Response(JSON.stringify({ error: '無權限訪問' }), { status: 403 });
        }

        console.log(doctorLoggedIn)

        if (doctorLoggedIn.doctor?.schedules.length === 0) {
            return NextResponse.json({
                schedule: []
            })
        }

        return NextResponse.json({
            schedule: doctorLoggedIn.doctor?.schedules[0].slots
        });
    } catch (error) {
        console.error('Error fetching doctor schedule:', error);
        return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
    }

}