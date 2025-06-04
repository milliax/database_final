import { supabase } from "@/lib/supabase";

export async function uploadImageToSupabase(file: File) {
    const fileName = `${Date.now()}`;

    try {
        // upload to /api/image/upload
        // create formData and post to /api/image/upload

        const formData = new FormData();

        formData.append("images", file);
        formData.append("bucket", "doctor-images");
        formData.append("name", fileName);

        const response = await fetch("/api/image/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("上傳圖片失敗: " + response.statusText);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error("上傳圖片失敗: " + data.error);
        }

        return {
            url: data.url,
            bucket: data.bucket,
            fileName: data.fileName,
        }

    } catch (error) {
        console.error("上傳圖片失敗:", error);
        throw new Error("上傳圖片失敗: " + error);
    }
}

export async function uploadAvatarToSupabase(
    file: File,
    userId: string,
    userToken: string,
    oldPhotoUrl?: string
): Promise<string> {

    const fileName = `${userId}-${Date.now()}.png`;


    console.log("開始上傳 Supabase 圖片:", fileName);



    if (oldPhotoUrl) {
        const oldFilePath = oldPhotoUrl.split("/avatars/")[1];
        if (oldFilePath) {
            console.log("嘗試刪除舊圖片:", oldFilePath);

            const { error: deleteError } = await supabase.storage.from("avatars").remove([oldFilePath]);
            if (deleteError) {
                console.error("無法刪除舊圖片:", deleteError.message);
            } else {
                console.log("舊圖片刪除成功");
            }
        }
    }

    const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
        });



    if (error) {
        throw new Error("Avatar upload failed: " + error.message);
    }


    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}