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
        }
    })

    const patient = await prisma.user.upsert({
        where: {
            email: "patient@admin.com"
        },
        update: {
            password: hashedPassword,
            role: "PATIENT",
        },
        create: {
            email: "patient@admin.com",
            name: "邱志揚",
            password: hashedPassword,
            role: "PATIENT",
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