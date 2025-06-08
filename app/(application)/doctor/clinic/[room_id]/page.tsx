
import ClientPage from "./client_page"

import { prisma } from "@/lib/prisma";

export default async function DoctorClinicPageWithRoom({
    params
}: {
    params: Promise<{
        room_id: string
    }>
}) {
    const roomId = (await params).room_id;

    console.log("roomId: ", roomId);

    const room = await prisma.consultingRoom.findUnique({
        where: {
            id: roomId
        }
    })

    const isRoomValid = room !== null;

    if (!isRoomValid) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Invalid Room ID</h1>
                <p className="text-gray-500">The room you are trying to access does not exist.</p>
            </div>
        );
    }

    const is_clinic_watching_time = false;

    const progress = room.status

    return (
        <ClientPage
            roomId={roomId}
            status={progress}
            isClinicWatchingTime={is_clinic_watching_time}
        />
    )
}
