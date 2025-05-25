import { prisma } from "@/lib/prisma";

export const GET = async () => {

    
    const user = await prisma.user.update({
        where:{
            id: "cmaxqicld00007kcpxp67e0nb",
        },data:{
            name: "Updated User Name",
        }
    })
    
    const users = await prisma.user.findMany({
        where:{},
        include:{
            sessions: true,
        }
    })

    const del = await prisma.user.delete({
        where:{
            id: "cmaxqicld00007kcpxp67e0nb",
        }
    })
    

    console.log(users);

    return new Response(JSON.stringify(users), {
        status: 200,
    })
}


