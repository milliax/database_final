import { NextResponse } from 'next/server';
image: "/images/dr-wang.jpg"

import { prisma } from '@/lib/prisma';

export async function GET() {

  const doctor = await prisma.user.findMany({
    where: {
      role: "DOCTOR"
    }, include: {
      doctor: true
    }
  })

  console.log(doctor)

  // const dummyDoctors = [
  //   { id: 1, name: 'Dr. Wang', department: '內科', "image": "/images/dr-wang.jpg" },
  //   { id: 2, name: 'Dr. Lin', department: '皮膚科', "image": "/images/dr-yang.jpg" },
  // ];

  return NextResponse.json(doctor);
}