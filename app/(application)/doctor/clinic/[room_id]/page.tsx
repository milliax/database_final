
import ClientPage from "./client_page"

export default async function DoctorClinicPageWithRoom({
    params
}: {
    params: Promise<{
        room_id: string
    }>
}) {
    const roomId = (await params).room_id;

    console.log("roomId: ", roomId);

    return (
        <ClientPage roomId={roomId} />
    )
}
