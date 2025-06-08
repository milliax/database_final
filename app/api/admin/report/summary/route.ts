import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { addHours } from "date-fns";

export async function GET() {
    // 計算日期範圍
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7 - today.getDay());
    lastWeekStart.setHours(0, 0, 0, 0);

    // 昨天 00:00:00 ~ 23:59:59
    const yesterdayStart = new Date(yesterday);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(24, 0, 0, -1);

    // 上週 7天前 00:00:00 ~ 今天 23:59:59
    const lastWeekEnd = new Date(today);
    lastWeekEnd.setDate(today.getDate() - today.getDay() - today.getDay());
    lastWeekEnd.setHours(23, 59, 59, 999);

    // log for times

    console.log("今天:", addHours(today, 8));
    // console.log("昨天:", yesterday);
    // console.log("昨天開始:", yesterdayStart);
    // console.log("昨天結束:", yesterdayEnd);
    // console.log("上週開始:", lastWeekStart);
    // console.log("上週結束:", lastWeekEnd);
    // console.log("當前時間:", new Date());
    console.log("當前時間 + 8小時:", addHours(new Date(), 8));
    console.log("昨天開始 + 8小時:", addHours(yesterdayStart, 8));
    console.log("昨天結束 + 8小時:", addHours(yesterdayEnd, 8));
    console.log("上週開始 + 8小時:", addHours(lastWeekStart, 8));
    console.log("上週結束 + 8小時:", addHours(lastWeekEnd, 8));
    // console.log("所有時間 + 8小時:", allConsultations.map(c => addHours(new Date(c.createdAt), 8)));


    // 取得所有 Consultation（含 Feedback、ConsultingRoom、Doctor、User）
    const allConsultations = await prisma.consultation.findMany({
        include: {
            Feedback: true,
            ConsultingRoom: {
                include: {
                    doctor: {
                        include: { user: true }
                    }
                }
            }
        }
    });

    // 統計計算 function
    function calcStats(consultations: any[]) {
        const totalReservations = consultations.length;
        const noShowCount = consultations.filter(c => c.consultingStatus === "NO_SHOW").length;
        const noShowRate = totalReservations === 0 ? 0 : noShowCount / totalReservations;
        const ratings = consultations.flatMap(c => c.Feedback.map((f: any) => f.rating).filter((r: any) => typeof r === "number"));
        const avgRating = ratings.length === 0 ? 0 : (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length);
        return { totalReservations, noShowRate, avgRating: Number(avgRating.toFixed(2)) };
    }

    // 昨天
    const yesterdayConsultations = allConsultations.filter(c =>
        new Date(c.createdAt) >= yesterdayStart && new Date(c.createdAt) <= yesterdayEnd
    );
    // 上週
    const lastWeekConsultations = allConsultations.filter(c =>
        new Date(c.createdAt) >= lastWeekStart && new Date(c.createdAt) <= lastWeekEnd
    );

    // 醫生分組
    const doctorMap: Record<string, { yesterday: any; lastWeek: any }> = {};
    for (const c of allConsultations) {
        const doctorName = c.ConsultingRoom?.doctor?.user?.name || "未知醫生";

        if (!doctorMap[doctorName]) {
            doctorMap[doctorName] = { yesterday: [], lastWeek: [] };
        }
        const createdAt = new Date(c.createdAt);
        if (createdAt >= yesterdayStart && createdAt <= yesterdayEnd) {
            doctorMap[doctorName].yesterday.push(c);
        }
        if (createdAt >= lastWeekStart && createdAt <= lastWeekEnd) {
            doctorMap[doctorName].lastWeek.push(c);
        }
    }
    // 將陣列轉成統計
    Object.keys(doctorMap).forEach(name => {
        doctorMap[name] = {
            yesterday: calcStats(doctorMap[name].yesterday),
            lastWeek: calcStats(doctorMap[name].lastWeek),
        };
    });

    return NextResponse.json({
        yesterday: calcStats(yesterdayConsultations),
        lastWeek: calcStats(lastWeekConsultations),
        doctors: doctorMap,
    });
}