import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { z } from "zod"
import { prisma } from '@/lib/prisma';

import bcrypt from 'bcrypt'

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.role || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const postSchema = z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(6),
    });
    try {
        const body = await req.json();
        const parsedBody = postSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
        const { email, name, password } = parsedBody.data;

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new doctor user
        const newDoctor = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'DOCTOR',

                doctor: {
                    create: {},
                },
            },
        });

        return NextResponse.json(newDoctor);
    } catch (error) {
        console.error('Error creating doctor:', error);
        return NextResponse.json({ error: '創建醫生失敗' }, { status: 500 });
    }
}
