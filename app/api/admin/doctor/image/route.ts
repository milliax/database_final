import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const zodSchema = z.object({
        doctorId: z.string(),
        imageURL: z.string().url(),
    });

    try {
        const body = await req.json();
        const parsedBody = zodSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({ error: '無效的請求格式' }, { status: 400 });
        }

        const { doctorId, imageURL } = parsedBody.data;

        const doctor = await prisma.user.update({
            where:{
                id: doctorId,
            },
            data:{
                image: imageURL,    
            }
        })

        return NextResponse.json({});
    } catch (error) {
        console.error('Error updating doctor image:', error);
        return NextResponse.json({ error: '更新醫生圖片失敗' }, { status: 500 });
    }
}