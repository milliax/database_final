import { NextResponse, NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
// import { z } from 'zod';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export const GET = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email || "",
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user
        });

    } catch (error) {
        console.error("Error fetching patient profile:", error);
        return NextResponse.json({ error: "Failed to fetch patient profile" }, { status: 500 });
    }
}

export const PUT = async (req: NextRequest) => {
    
}