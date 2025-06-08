import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { id, commentContent, commentRating } = await req.json();
    try {
        // consultationId 在 Feedback 必須是唯一的
        // await prisma.feedback.upsert({
        //     where: { consultationId: id },
        //     update: { comment: commentContent, rating: commentRating },
        //     create: {
        //         consultationId: id,
        //         comment: commentContent,
        //         rating: commentRating,
        //     },
        // });

        await prisma.consultation.update({
            where: { id },
            data: {
                Feedback: {
                    create: {
                        comment: commentContent,
                        rating: commentRating,
                    },
                },
            },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }
}