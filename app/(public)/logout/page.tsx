"use client"
import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        signOut()
        router.push("/")
    }, [])

    return (
        <div>
            <h1>Logout</h1>
        </div>
    )
}