import { NextResponse, NextRequest } from 'next/server';
// import { prisma } from '@/lib/prisma';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

import sharp from 'sharp';
import { supabase } from '@/lib/supabase-server';

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const formData = await req.formData();

    const files = formData.getAll('images') as File[];
    const bucket = formData.get('bucket') as string;
    const fileName = formData.get('name') as string;

    // only deal with the first file
    const file = files[0];

    try {
        const fileBuffer = await file.arrayBuffer();
        const image = await sharp(fileBuffer)
            .jpeg({ quality: 80 })
            .toBuffer();

        // const fileName = `${randomUUID()}.jpg`;

        console.log('fileName', fileName);
        console.log('bucket', bucket);

        const { data, error } = await supabase.storage.from(bucket).upload(fileName, image, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'image/jpeg',
        });

        if (error) {
            console.error('Error uploading image:', error);
            return NextResponse.json({ error: '上傳圖片失敗' }, { status: 500 });
        }

        // await supabase.storage.from(bucket).upload(fileName, image, {})

        return NextResponse.json({
            url: data.fullPath,
            bucket: 'post-images',
            fileName: fileName,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: '創建貼文失敗' }, { status: 500 });
    }
}