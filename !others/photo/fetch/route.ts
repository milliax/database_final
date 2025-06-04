import { NextResponse, NextRequest } from 'next/server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

import { supabase } from '@/lib/supabase-server';

export const GET = async (req: NextRequest,
    { params }: { params: Promise<{ params: string[] }> }
) => {
    // return image from supabase bucket

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // TODO: verify if the user is valid for the image

    const p = (await params).params;

    console.log("params", p)

    console.log(p[0])
    console.log(p[1])

    try {
        const { data, error } = await supabase.storage
            .from(p[0])
            .download(p[1]);

        if (error) {
            console.log('Error downloading image:', error);
            return NextResponse.json({ error: '找不到圖片' }, { status: 404 });
        }

        return new Response(data, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `inline; filename=${p[1]}`,
            },
        });

    } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
    }
}