import { NextResponse, NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { add, addHours, addDays } from 'date-fns';

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const today = addHours(new Date(), 0);
        const start_of_day = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // read doctor's schema

        const doctor = await prisma.doctor.findFirst({
            where: {
                user: {
                    email: session.user.email
                }
            },
            include: {
                schedules: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc',
                    }
                }
            }
        })

        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        // check if doctor has schedules
        if (doctor.schedules.length === 0) {
            return NextResponse.json({ error: "Doctor has no schedules" }, { status: 404 });
        }

        // upsert the 8 most recent consulting room fot the doctor
        const schedule = doctor.schedules[0].slots;
        const day_of_today = (today.getDay() + 6) % 7; // Adjusting to match the schedule's day index (1-7)

        // let movingDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let movingSlot = 0
        let slot_number = day_of_today;

        let meeting_founds = 0;

        const max_iteration = 21 * 7;
        let iteration = 0

        console.log("Today: ", today.toDateString())

        console.log("schedule: ");
        console.log(schedule);

        while (meeting_founds <= 8 && iteration < max_iteration) {
            console.log(`Iteration: ${iteration}, Slot Number: ${slot_number}, Moving Slot: ${movingSlot}`);

            iteration++;

            if (schedule[slot_number] === 1) {
                // create a new consulting room
                console.log(`Creating consulting room for slot: ${slot_number}, Moving Slot: ${movingSlot}`);

                await prisma.consultingRoom.upsert({
                    where: {
                        doctorId_day_slot: {
                            doctorId: doctor.id,
                            day: addDays(start_of_day, Math.floor(movingSlot / 3)),
                            slot: slot_number
                        }
                    }, create: {
                        doctorId: doctor.id,
                        day: addDays(start_of_day, Math.floor(movingSlot / 3)),
                        slot: slot_number,
                    }, update: {}
                })

                meeting_founds++;
            }

            // next slot


            if (slot_number === 20) {
                slot_number = -1
            } else {
                slot_number = (slot_number + 7) % 21;
            }

            if (movingSlot % 3 === 2) {
                slot_number = (slot_number + 1) % 21
            }
            movingSlot++;
        }

        // create consulting rooms if not exists

        const clinicStatus = await prisma.consultingRoom.findMany({
            where: {
                doctorId: session.user.id,

                day: {
                    gte: start_of_day,
                },
                OR: [
                    { status: "PENDING" },
                    { status: "IN_PROGRESS" },
                ]
            },
            take: 5,
            orderBy: [
                { day: 'asc' },
                { slot: 'asc' },
            ]
        });

        if (!clinicStatus) {
            return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
        }

        return NextResponse.json(clinicStatus);
    } catch (error) {
        console.error('Error fetching clinic rooms:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}