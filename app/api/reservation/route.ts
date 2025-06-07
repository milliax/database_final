import { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

import { z } from 'zod';

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

        const { doctor_id, date, time } = parsedBody.data;

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

        await prisma.$transaction(async (tx) => {

            // fetch consulting room, checking the the limit exceed

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
                return new Response(JSON.stringify({ error: "This time slot is fully booked" }), { status: 400 });
            }

            console.log(session.user)

            console.log(doctor.id)
            console.log(normalizedDay, time)

            const user = await tx.user.findUnique({
                where: {
                    email: session.user.email || "",
                },
                include: {
                    patient: true,
                }
            });

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
        console.error("Error in reservation route:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}