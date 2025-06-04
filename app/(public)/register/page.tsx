"use client"

import CalendarWithYear from "@/components/calendar_with_year"
import clsx from "clsx"

import { useState, useRef } from "react"
import Swal from "sweetalert2"

export default function RegisterPage() {
    const [idType, setIdType] = useState<0 | 1 | 2>(0)
    const nameRef = useRef<HTMLInputElement | null>(null)
    const idRef = useRef<HTMLInputElement | null>(null)

    const [birthDay, setBirthDay] = useState<Date | undefined>(undefined)
    const [issueDay, setIssueDay] = useState<Date | undefined>(undefined)

    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (loading) return // Prevent multiple submissions while loading

        const type = idType === 0 ? "初發" : idType === 1 ? "補發" : "換發"

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name: nameRef.current?.value,
                    id: idRef.current?.value,

                    birth_date: birthDay?.toISOString(),
                    issue_date: issueDay?.toISOString(),
                    issue_type: idType.toString(), // Convert to string for the API

                    location: e.currentTarget.location.value,
                })
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "註冊失敗，請稍後再試");
            }

            // alert("註冊成功，請記住您的密碼為：MMDD（MM為出生月份，DD為出生日期）")

            Swal.fire({
                icon: 'success',
                title: '註冊成功',
                text: `您的身分證 ${type} 已成功註冊，請記住您的密碼為：MMDD（MM為出生月份，DD為出生日期）`,
                confirmButtonText: '前往登入',
            }).then(() => {
                setTimeout(() => {
                    window.location.href = "/summary"; // Redirect to login page
                }, 100)
            })

        } catch (error) {
            console.error("註冊失敗:", error);
            Swal.fire({
                icon: 'error',
                title: '註冊失敗',
                text: error instanceof Error ? error.message : '請稍後再試',
            })
        }
        setLoading(false)
    }

    return (
        <main className="flex flex-col justify-center items-center w-screen h-[calc(100vh-5rem)] space-y-5">
            <h1 className="text-2xl font-bold w-fit">註冊</h1>
            <form className="flex flex-col space-y-4 w-[30rem] px-3 py-3 rounded-md" onSubmit={(e) => {
                e.preventDefault()
                // submit form data
                handleSubmit(e); // Call the submit handler
            }}>
                <div className="flex flex-row gap-3 items-center">
                    <label className="w-32">姓名</label>
                    <input
                        type="text"
                        placeholder="name"
                        className="border rounded-md p-2 w-full"
                        required
                        ref={nameRef}
                    />
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <label className="w-32">出生年月日</label>
                    <CalendarWithYear date={birthDay}
                        setDate={setBirthDay}
                    />
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <label className="w-32">身分證字號</label>
                    <input
                        type="text"
                        placeholder="id"
                        className="border rounded-md p-2 w-full"
                        required
                        name="id"
                        ref={idRef}
                    />
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <label className="w-32">發證日期</label>
                    <CalendarWithYear date={issueDay}
                        setDate={setIssueDay}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="w-32">身分證換證地點</label>
                    <select className="outline py-1 rounded-md" name="location" required defaultValue="none">
                        <option value="none" disabled>請選擇縣市</option>
                        <option value="北市">北市</option>
                        <option value="北縣">北縣</option>
                        <option value="新北市">新北市</option>
                        <option value="基市">基市</option>
                        <option value="桃市">桃市</option>
                        <option value="桃縣">桃縣</option>
                        <option value="竹市">竹市</option>
                        <option value="竹縣">竹縣</option>
                        <option value="苗縣">苗縣</option>
                        <option value="中市">中市</option>
                        <option value="中縣">中縣</option>
                        <option value="投縣">投縣</option>
                        <option value="彰縣">彰縣</option>
                        <option value="雲縣">雲縣</option>
                        <option value="嘉市">嘉市</option>
                        <option value="嘉縣">嘉縣</option>
                        <option value="南市">南市</option>
                        <option value="南縣">南縣</option>
                        <option value="高市">高市</option>
                        <option value="高縣">高縣</option>
                        <option value="屏縣">屏縣</option>

                        <option value="宜縣">宜縣</option>
                        <option value="花縣">花縣</option>
                        <option value="東縣">東縣</option>

                        <option value="澎縣">澎縣</option>

                        <option value="金門">金門</option>
                        <option value="連江">連江</option>
                    </select>
                    {/* <input
                        type="text"
                        placeholder="縣市"
                        className="border rounded-md p-2 w-full"
                        required
                    /> */}
                </div>
                <div className="flex flex-col gap-3">
                    <label className="w-32">身分證領補換類別</label>
                    <div className="grid grid-cols-3 gap-3 bg-neutral-100 rounded-md p-3">
                        <div className={clsx("w-full h-12 rounded-md flex flex-row items-center justify-center",
                            idType === 0 ? "bg-sky-300" : "bg-white")} onClick={() => {
                                setIdType(0)
                            }}>初發</div>
                        <div className={clsx("w-full h-12 rounded-md flex flex-row items-center justify-center",
                            idType === 1 ? "bg-sky-300" : "bg-white")} onClick={() => {
                                setIdType(1)
                            }}>補發</div>
                        <div className={clsx("w-full h-12 rounded-md flex flex-row items-center justify-center",
                            idType === 2 ? "bg-sky-300" : "bg-white")} onClick={() => {
                                setIdType(2)
                            }}>換發</div>
                    </div>
                </div>

                {/* TODO: Upload ID photo
                <div>
                    上傳身分證照片
                </div> */}
                <button type="submit"
                    className={clsx("w-full h-12 rounded-md text-white",
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-400")}
                    disabled={loading}>
                    {loading ? "註冊中..." : "註冊"}
                </button>
            </form>
        </main >
    )
}