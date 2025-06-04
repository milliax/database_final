"use client"

import TextareaAutosize from 'react-textarea-autosize';
import { CalendarIcon, PaperClipIcon, TagIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
import React, { useState, Fragment, useEffect, useRef } from 'react';
import { clsx } from "clsx";
import Swal from 'sweetalert2';

// import { getAuth } from "firebase/auth";
// import { app } from "@/app/firebase";
// import { useAuthState } from "react-firebase-hooks/auth";

import { useSession } from "next-auth/react";

import { useRouter } from 'next/navigation';
import { uploadImageToSupabase } from '@/lib/uploadHelper';
import HashtagInput from '@/components/hashTagInput';

export default function PostInFeed() {
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [bufferURLs, setBufferURLs] = useState<string[]>([])
    const router = useRouter();
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [imageUploaded, setImageUploaded] = useState<{
        url: string;
        bucket: string;
        fileName: string;

        originalName: string;
    }[]>([]);
    const { data: session, status } = useSession();
    const [resetInput, setResetInput] = useState(0);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
            return;
        }
    }, [session?.user.id]);

    const createNewPost = async () => {
        try {
            if (!session) throw new Error("User not authenticated");

            let checkingPass = true;

            for (const im of selectedImages) {
                if (!(imageUploaded.find((img) => img.originalName === im.name))) {
                    checkingPass = false;
                    break;
                }
            }

            if (!checkingPass) {
                Swal.fire({
                    icon: "info",
                    title: "照片上傳中",
                    text: "請稍後再試一次",
                });
                return;
            }

            const res = await fetch("/api/post/main", {
                method: "POST",
                body: JSON.stringify({
                    description,
                    photo: imageUploaded.map((img) => {
                        return {
                            url: img.url,
                            bucket: img.bucket,
                            fileName: img.fileName,
                        }
                    }),
                    location,
                })
            })

            if (res.ok) {
                setDescription("");
                setSelectedImages([]);
                setBufferURLs([]);
                setResetInput((prev) => prev + 1);

                Swal.fire({
                    icon: "success",
                    title: "貼文已成功發佈！",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                const errorData = await res.json();
                console.error("發佈貼文失敗:", errorData);
                Swal.fire({
                    icon: "error",
                    title: "發佈失敗",
                    text: errorData.message || "請稍後再試一次",
                });
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "發佈失敗",
                text: "請稍後再試一次",
            });
        }

    }

    const attachImages = async (event: React.ChangeEvent<HTMLInputElement>, exist = false) => {
        const files = event.target.files;

        console.log(files)
        if (!files) return;

        const newFiles = Array.from(files);

        const uniqueFiles = newFiles.filter((file) =>
            !selectedImages.some((existingFile) => existingFile.name === file.name)
        );

        if (uniqueFiles.length === 0) return;

        // upload selected images to Supabase
        if (!exist) {
            const newBufferURLs = uniqueFiles.map((file) => URL.createObjectURL(file));
            setBufferURLs((prev) => [...prev, ...newBufferURLs]);
            setSelectedImages((prev) => [...prev, ...uniqueFiles]);
        }

        try {
            const p = await uploadImageToSupabase(uniqueFiles[0]);

            setImageUploaded((prev) => [...prev, {
                url: p.url,
                bucket: p.bucket,
                fileName: p.fileName,

                originalName: uniqueFiles[0].name
            }]);
        } catch (err) {
            console.error("上傳圖片失敗:", err);

            setTimeout(() => {
                attachImages(event, true);
            }, 1000)
        }

    }

    // useEffect(() => {
    //     console.log("selectedImages", selectedImages)
    //     console.log("bufferURLs", bufferURLs)
    //     console.log("imageUploaded", imageUploaded)

    // }, [selectedImages, bufferURLs, imageUploaded]);

    return (
        <React.Fragment>
            <form className="relative"
                onSubmit={(event) => {
                    event.preventDefault();
                    createNewPost();
                }}>
                <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <label htmlFor="thoughts" className="sr-only">
                        Thoughts
                    </label>
                    {/* <TextareaAutosize
                        minRows={2}
                        name="thoughts"
                        id="thoughts"
                        className="outline-none block w-full resize-none border-0 py-5 px-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="寫點什麼嗎？"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    /> */}

                    <HashtagInput setDescription={setDescription}
                        className="px-3 py-2 min-h-20"
                        placeholder="寫點什麼嗎？"
                        description={description}
                        reset={resetInput}
                    />

                    {/* Spacer element to match the height of the toolbar */}
                    <div aria-hidden="true">
                        <div className="py-2">
                            <div className="h-9" />
                        </div>
                        <div className="h-px" />
                    </div>
                </div>
                <div className="absolute inset-x-px bottom-0">

                    <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
                        <div className="flex pl-3">
                            <label className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400 cursor-pointer group">
                                <input type="file"
                                    name="images_to_upload"
                                    className="hidden"
                                    multiple
                                    accept='.jpg,.jpeg,.png'
                                    onChange={(event) => { attachImages(event) }}
                                />
                                <PaperClipIcon className="-ml-1 mr-2 h-5 w-5 group-hover:text-gray-500" />
                                <span className='group-hover:text-gray-500'>上傳照片</span>
                            </label>
                        </div>

                        <div className="flex-shrink-0">
                            <button type="submit"
                                className="inline-flex items-center rounded-md bg-[#fa003b] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e60035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fa003b]"
                            >
                                發佈
                            </button>
                        </div>
                    </div>
                </div>
            </form >

            {bufferURLs.length > 0 && (
                <div className="mt-4 flex flex-row gap-4">
                    {bufferURLs.map((img, i) => (
                        <div key={i} className="relative w-fit h-fit">
                            <img src={img} className="w-fit h-40 object-contain rounded-md" />
                            <button
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1"
                                onClick={() => {
                                    setSelectedImages((prev) => prev.filter((_, index) => index !== i));
                                    setBufferURLs((prev) => prev.filter((_, index) => index !== i));
                                    // setSelectedImages((prev) => prev.filter((_, i) => i !== i));
                                    // setBufferURLs((prev) => prev.filter((_, i) => i !== i));
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </React.Fragment>
    )
}

