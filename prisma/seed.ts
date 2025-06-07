import { PrismaClient } from '@/generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'password'

    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Create a new user
    const admin = await prisma.user.upsert({
        where: {
            email: "admin@admin.com"
        },
        update: {
            password: hashedPassword,
            role: "ADMIN",
        },
        create: {
            email: "admin@admin.com",
            name: "管理員",
            password: hashedPassword,
            role: "ADMIN",
        }
    })

    const doctorA = await prisma.user.upsert({
        where: {
            email: "doctor@admin.com"
        },
        update: {
            password: hashedPassword,
            role: "DOCTOR",
        },
        create: {
            email: "doctor@admin.com",
            name: "醫生",
            password: hashedPassword,
            role: "DOCTOR",

            doctor: {
                create: {}
            }
        }
    })

    const doctorB = await prisma.user.upsert({
        where: {
            email: "doc@admin.com"
        },
        update: {
            password: hashedPassword,
            role: "DOCTOR",
        },
        create: {
            email: "doc@admin.com",
            name: "醫者",
            password: hashedPassword,
            role: "DOCTOR",

            doctor: {
                create: {}
            }
        }
    })

    const patient_password = `${`0${new Date("2000-01-01").getMonth() + 1}`.slice(-2)}${`0${new Date("2000-01-01").getDate()}`.slice(-2)}`
    const hashedPatientPassword = await bcrypt.hash(patient_password, 10)

    const patient = await prisma.user.upsert({
        where: {
            email: "A123456789"
        },
        update: {
            password: hashedPatientPassword,
            role: "PATIENT",
        },
        create: {
            email: "A123456789",
            name: "邱志揚",
            password: hashedPatientPassword,
            role: "PATIENT",

            patient: {
                create: {
                    id_card_number: "A123456789",
                    birth_date: new Date("2000-01-01T00:00:00.000Z"),
                    id_card_issue_date: new Date("2020-01-01T00:00:00.000Z"),
                    id_card_location: "台北市",
                    id_card_issue_type: "初發",
                },
            },
        }
    })

}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })