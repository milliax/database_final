import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import bcrypt from "bcryptjs";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: { email: session.user.email || "" },
            include: { patient: true }
        });
        if (!user || !user.patient) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({
            name: user.name,
            bio: user.patient.bio,
            birth_date: user.patient.birth_date,
            phone: user.phone,
            address: user.address,
            emergency_contact_name: user.patient.emergency_contact_name || "",
            emergency_contact_phone: user.patient.emergency_contact_phone || "",
            email: user.patient.email || user.email || "",
            id_card_image: user.patient.id_card_image || "",
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch patient profile" }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const {
            name,
            bio,
            birth_date,
            phone,
            address,
            emergency_contact_name,
            emergency_contact_phone,
            email,
            id_card_image,
        } = body;

        // 找到 user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email || "" },
            include: { patient: true }
        });
        if (!user || !user.patient) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 取得 MMDD 密碼字串
        let newPassword = undefined;
        if (birth_date) {
            const dateObj = typeof birth_date === "string" ? new Date(birth_date) : birth_date;
            const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
            const dd = String(dateObj.getDate()).padStart(2, "0");
            // 這裡先產生明文密碼
            const plainPassword = mm + dd;
            // hash 密碼
            newPassword = await bcrypt.hash(plainPassword, 10);
        }

        // 更新 User
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name ?? user.name,
                phone: phone ?? user.phone,
                address: address ?? user.address,
                ...(newPassword && { password: newPassword }),
            }
        });

        // 更新 Patient
        await prisma.patient.update({
            where: { userId: user.id },
            data: {
                bio: bio ?? user.patient.bio,
                birth_date: birth_date ? new Date(birth_date) : user.patient.birth_date,
                emergency_contact_name: emergency_contact_name ?? user.patient.emergency_contact_name,
                emergency_contact_phone: emergency_contact_phone ?? user.patient.emergency_contact_phone,
                email: email ?? user.patient.email,
                id_card_image: id_card_image ?? user.patient.id_card_image,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update patient profile" }, { status: 500 });
    }
};