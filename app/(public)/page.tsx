import Image from "next/image";
import Button from "@/components/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="font-sans">
            {/* Header */}
            {/* <header className="bg-yellow-300 px-6 py-2 text-sm flex justify-between items-center">
                <div className="text-gray-800">
                    回醫療體系首頁 | 回台大醫院首頁 | 網站導覽 | English | 日本語
                </div>
                <div className="flex space-x-2">
                    <button className="text-xs">A-</button>
                    <button className="text-xs font-bold">A</button>
                    <button className="text-xs">A+</button>
                </div>
            </header> */}

            {/* Logo and Navigation */}
            <div className="bg-yellow-400 px-6 py-4 flex items-center justify-between">
                <div className="text-2xl font-bold">
                    <span className="text-green-700">邱綜合醫院</span> 
                    {/* 國立臺灣大學醫學院附設醫院 */}
                </div>
                <nav className="flex space-x-4 text-sm">
                    <a href="#">訊息專區</a>
                    <a href="#">認識本院</a>
                    <a href="#">就醫指南</a>
                    <a href="#">醫療團隊</a>
                    <a href="#">特色醫療</a>
                    <a href="#">為民服務</a>
                    <a href="#">教學研究</a>
                </nav>
            </div>

            {/* Image Banner */}
            <div className="w-full h-[40rem] bg-cover bg-center">
                {/* Image slider dots if needed */}
                <Image src="/images/library.jpg"
                    alt="library"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Function Bar */}
            <div className="bg-yellow-200 px-6 py-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center space-x-4 mb-4">
                        <input placeholder="搜尋..." className="w-full max-w-md" />
                    </div>
                    <div className="flex justify-center space-x-8 text-sm">
                        <button className="flex flex-col items-center">
                            {/* <Search className="mb-1" /> 網路掛號 */}
                        </button>
                        <button className="flex flex-col items-center">
                            {/* <Calendar className="mb-1" /> 門診相關 */}
                        </button>
                        <button className="flex flex-col items-center">
                            {/* <User className="mb-1" /> 尋找醫師 */}
                        </button>
                    </div>
                </div>
            </div>

            {/* Icon Grid */}
            <div className="bg-yellow-100 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 text-sm text-center">
                <div>🏥 住院及探病相關</div>
                <div>🩺 健康檢查</div>
                <div>🧳 海外病友</div>
                <div>📍 交通設施</div>
                <div>💊 衛教及用藥諮詢</div>
                <div>📄 就醫資料申請</div>
                <div>➕ 人才招募</div>
            </div>
        </div>
    );
}
// <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

//     <div className="flex flex-col items-center justify-center">
//         <Image
//             src="/logo.png"
//             alt="Logo"
//             width={100}
//             height={100}
//             className="mb-4"
//         />
//         <h1 className="text-2xl font-bold">Welcome to the App</h1>
//     </div>

//     <div className="flex flex-col items-center justify-center">
//         <p className="text-lg mb-4">Hello.</p>

//         <Link href="/doctors">
//             <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//                 醫生介紹
//             </button>
//         </Link>
//     </div>
//     <footer className="text-sm text-gray-500">
//         &copy; 2023 Your Company Name
//     </footer>

//     <Button />
// </div>