"use client"

const decorateClassName = "bg-white w-full h-12 px-3 border ";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bounce, toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

import Link from "next/link";

// import { createClient } from '@/lib/supabase/client';

import { signIn } from "next-auth/react"

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const customSignIn = async () => {
        setLoading(true);
        try {
            const response: any = await signIn("credentials", {
                username: email,
                password,
                redirect: false,
            })
            // console.log(response)

            if (!response?.error) {
                router.push("/")
                router.refresh();
                // router.push("/")
                // router.refresh()
            }
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            // console.log("Login Successful", response)

            toast.success("登入成功", {
                transition: Bounce,
                autoClose: 5000,
                position: "top-center"
            })

        } catch (err) {
            console.log(err)
            toast.error("帳號或密碼錯誤", {
                transition: Bounce,
                autoClose: 5000,
                position: "top-center"
            })
        }
        setLoading(false)
    }

    useEffect(() => {
        const message = searchParams.get("message");

        if (message !== null) {
            router.replace(`/login`)
            toast.info(decodeURI(message), {
                transition: Bounce,
                autoClose: 5000,
                position: "top-center"
            })
        }
    }, [])

    return (
        <main className="flex flex-col justify-center items-center w-screen h-[calc(100vh-5rem)] space-y-5">
            <div className="text-xl font-bold">小診所</div>
            <div className="border rounded-md shadow-lg">
                <form onSubmit={async (event) => {
                    event.preventDefault();
                    customSignIn();
                }} className="px-10 py-8 space-y-3">
                    <input className={decorateClassName}
                        placeholder="使用者名稱"
                        value={email}
                        type="text"
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <input className={decorateClassName}
                        placeholder="密碼"
                        type="password"
                        value={password}
                        onChange={event => {
                            setPassword(event.target.value)
                        }}
                    />

                    {/* TODO: No links of terms and privacy */}
                    {loading ?
                        <div className="w-full bg-orange-400 rounded-lg h-12 text-white flex justify-center items-center">
                            請稍後
                        </div>
                        :
                        <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 rounded-lg h-12 text-white">
                            登入
                        </button>
                    }
                </form>
            </div>

            <div>
                <span>還沒有帳號嗎</span>
                <Link href="/register" className="text-sky-600 hover:text-sky-500">立即註冊</Link>
            </div>
        </main>
    )
}