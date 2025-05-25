import { NextResponse, NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

import bcrypt from 'bcrypt';

import { addHours } from 'date-fns';

export const POST = async (req: NextRequest) => {

    try {

        const input_schema = z.object({
            name: z.string().min(1, "姓名為必填欄位"),
            id: z.string().min(1, "身分證字號為必填欄位"),
            birth_date: z.string().min(1, "出生年月日為必填欄位"),
            issue_date: z.string().min(1, "發證日期為必填欄位"),
            location: z.string().min(1, "身分證換證地點為必填欄位"),
            issue_type: z.string().min(1, "身分證換證類型為必填欄位"),
        })

        const body = await req.json();
        const p = input_schema.safeParse(body);

        if (!p.success) {
            return NextResponse.json({ error: p.error.errors[0].message }, { status: 400 });
        }

        const { name, id, birth_date, issue_date, location, issue_type } = p.data;

        const existingUser = await prisma.patient.findUnique({
            where: {
                id_card_number: id
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: "此身分證字號已被註冊" }, { status: 400 });
        }

        const birth = new Date(birth_date);

        const accurated_birth_day = addHours(birth, 8); // Adjust for timezone if needed
        const accurated_issue_date = addHours(new Date(issue_date), 8); // Adjust for timezone if needed

        const password = `${`0${accurated_birth_day.getMonth() + 1}`.slice(-2)}${`0${accurated_birth_day.getDate()}`.slice(-2)}`
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: id,
                password: hashedPassword,
                name: name,
                patient: {
                    create: {
                        id_card_number: id,
                        birth_date: accurated_birth_day,
                        id_card_issue_date: accurated_issue_date,
                        id_card_location: location,
                        id_card_issue_type: issue_type === "0" ? "初發" : issue_type === "1" ? "補發" : "換發",
                    },
                },

            },
        });

        console.log("New user created:", newUser, "with password:", password);
        console.log("hashedPassword", hashedPassword);
        return NextResponse.json({ message: "註冊成功，請使用身分證字號作為帳號，預設密碼為出生日期的月日（MMDD）" }, { status: 201 });
    } catch (error) {
        console.log("Error creating user:", error);
        return NextResponse.json({ error: "註冊失敗，請稍後再試" }, { status: 500 });
    }

}