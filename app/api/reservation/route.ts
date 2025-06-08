import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

import { z } from 'zod';
import { addHours } from 'date-fns';

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const postSchema = z.object({
        doctor_id: z.string(),
        date: z.string(),
        time: z.number(),
    });

    try {
        const body = await req.json();

        // Validate the request body
        const parsedBody = postSchema.safeParse(body);

        if (!parsedBody.success) {
            return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
        }

        const { doctor_id, time } = parsedBody.data;

        const date = addHours(parsedBody.data.date, 8)

        console.log(doctor_id, date, time);

        const now = new Date();

        if (new Date(date) < now) {
            return new Response(JSON.stringify({ error: "Cannot reserve a time in the past" }), { status: 400 });
        }

        // Check if the user is a patient
        if (session.user.role !== 'PATIENT') {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }
        // Check if the doctor exists
        const doctor = await prisma.user.findFirst({
            where: {
                doctor: {
                    id: doctor_id,
                },
                role: 'DOCTOR',
            },
            include: {
                doctor: {
                    include: {
                        schedules: {
                            orderBy: {
                                createdAt: 'desc',
                            },
                            take: 1, // Get the most recent schedule
                        }
                    }
                }
            }
        });
        if (!doctor) {
            return new Response(JSON.stringify({ error: "Doctor not found" }), { status: 404 });
        }

        // check if this time can be reserved
        const schedule = doctor.doctor?.schedules[0];
        if (!schedule || !schedule.slots) {
            return new Response(JSON.stringify({ error: "Doctor's schedule not found" }), { status: 404 });
        }

        const dateObj = new Date(date);
        const dayOfWeek = (dateObj.getDay() - 1) % 7; // Adjust to match the schedule's day of week (Monday = 0, ..., Sunday = 6)

        let timeSlot: number[] = []

        timeSlot.push(schedule.slots[dayOfWeek] || 0);
        timeSlot.push(schedule.slots[dayOfWeek + 7] || 0);
        timeSlot.push(schedule.slots[dayOfWeek + 14] || 0);

        console.log("time slot: ", timeSlot)

        if (timeSlot[time] === 0) {
            return new Response(JSON.stringify({ error: "This time slot is not available" }), { status: 400 });
        }

        const normalizedDay = new Date(Date.UTC(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate(),
        ))

        console.log("normalizedDay: ", normalizedDay)

        await prisma.$transaction(async (tx) => {

            // fetch consulting room, checking the the limit exceed

            // check if the customer has already reserved this time slot

            const user = await tx.user.findUnique({
                where: {
                    email: session.user.email || "",
                },
                include: {
                    patient: true,
                }
            });

            const pastReservation = await tx.consultation.findFirst({
                where: {
                    patient: {
                        id: user?.patient?.id || "",
                    },
                    ConsultingRoom: {
                        doctorId: doctor_id,
                        day: normalizedDay,
                        slot: time,
                    }
                }
            })

            console.log("pastReservation: ", pastReservation)

            if (pastReservation) {
                throw new Error("You have already reserved this time slot");
            }

            const existingReservation = await tx.consultingRoom.findFirst({
                where: {
                    doctorId: doctor.id,
                    day: normalizedDay,
                    slot: time,
                },
                select: {
                    max_consultation_number: true,
                    _count: {
                        select: {
                            consultations: true,
                        }
                    }
                }
            });

            if (existingReservation && existingReservation._count.consultations >= existingReservation.max_consultation_number) {
                throw new Error("This time slot is fully booked");
            }

            console.log(session.user)

            console.log(doctor.id)
            console.log(normalizedDay, time)

            const reservation = await tx.consultation.create({
                data: {
                    patient: {
                        connect: {
                            id: user?.patient?.id || "",

                        }
                    },
                    ConsultingRoom: {
                        connectOrCreate: {
                            where: {
                                doctorId_day_slot: {
                                    doctorId: doctor_id,
                                    day: normalizedDay,
                                    slot: time,
                                }
                            },
                            create: {
                                doctorId: doctor_id,
                                day: normalizedDay,
                                slot: time,
                            }
                        }
                    }

                },
            });

            // reservation finish
        })

        return new Response(JSON.stringify({ message: "Reservation created successfully" }), { status: 201 });
    } catch (error) {
        // handle prisma thrown errors

        // if error has key message

        const e: any = error

        if (e.message) {
            if (e.message.includes("This time slot is fully booked")) {
                return NextResponse.json(
                    { error: "此時段已滿，請選擇其他時段" },
                    { status: 400 }
                );
            } else if (e.message.includes("You have already reserved this time slot")) {
                return NextResponse.json(
                    { error: "此時段已預約，請選擇其他時段" },
                    { status: 400 }
                );
            }
        }


        // if(error && error.message){
        //     if(error.message.includes("You have already reserved this time slot")) {
        //         return new Response(JSON.stringify({ error: "You have already reserved this time slot" }), { status: 400 });
        //     }
        // }

        console.error("Error in reservation route:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}