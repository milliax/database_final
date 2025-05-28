import Image from "next/image";
import Button from "@/components/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mb-4"
        />
        <h1 className="text-2xl font-bold">Welcome to the App</h1>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Hello.</p>

        <Link href="/doctor">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            醫生介紹
          </button>
        </Link>
      </div>
      <footer className="text-sm text-gray-500">
        &copy; 2023 Your Company Name
      </footer>

      <Button />
    </div>
  );
}
