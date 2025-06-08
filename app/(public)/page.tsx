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
                </nav>
            </div>

            {/* Image Banner */}
            <div className="w-full h-[40rem] bg-cover bg-center">
                {/* Image slider dots if needed */}
                <Image src="/images/hosp.jpg"
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

            {/* 院長的話外層：背景圖 */}
            <div className="relative w-full flex justify-center items-center py-12">
                {/* 半透明背景圖 */}
                <Image
                    src="/images/chiuzongheyiyuan.jpg"
                    alt="邱綜合醫院"
                    fill
                    className="object-cover opacity-30 pointer-events-none select-none"
                    style={{ zIndex: 0 }}
                />
                {/* 白色卡片內容 */}
                <div className="relative z-10 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">院長的話</h2>
                    <div className="text-gray-800 leading-relaxed">
                        <p>
                            當初我只是肚子痛，來醫院掛個號，結果一個轉身，不小心當上了院長。到現在我都還在懷疑，是不是有人在我打點滴的時候，順便幫我簽了聘書。
                        </p>
                        <p className="mt-4">
                            自從當上院長之後，我每天的生活就像連續劇，一樓在急診上演動作片，二樓在內科播溫馨家庭劇，三樓手術室則是不定時推出驚悚片特輯。而我呢？穿著白袍在各科穿梭，偶爾被誤認是實習醫生，還會被護士姐姐提醒：「小朋友，這裡不能跑來跑去喔！」
                        </p>
                        <p className="mt-4">
                            但說實話，當院長也沒什麼不好，除了開會很多、責任很大、電話永遠響不停之外，其他都還可以接受（好啦，其實沒幾件可以接受的）。我最大的樂趣就是看見病人逐漸康復，醫護人員在壓力中仍能保持笑容，還有看到有人終於找到出口，不再每天問：「停車場怎麼走？」
                        </p>
                        <p className="mt-4">
                            我們醫院的宗旨很簡單：醫得好、笑得出、走得快（不是被趕走的那種，是康復離院的那種）。我們相信，醫療不是冷冰冰的儀器堆，而是一群有血有淚、偶爾很有戲的醫療人員，努力為大家撐起一個可以安心、放心、放心大笑的地方。
                        </p>
                        <p className="mt-4">
                            最後提醒大家，醫院雖然不是咖啡館，但歡迎大家有事沒事來晃晃，除了有專業的醫療團隊，還有免費的白開水、冷氣開放、偶爾還能看到院長我迷路。
                        </p>
                        <p className="mt-4">
                            歡迎光臨，祝您健康快樂，也祝我手機有一天可以靜音成功。
                        </p>
                        <div className="text-right mt-4 font-semibold">—— 院長 敬上</div>
                    </div>
                </div>
            </div>

            {/* 院址等資訊區塊 */}
            <div className="w-full bg-white py-8 px-4 mt-3">
                <div className="max-w-4xl mx-auto text-center text-gray-700">
                    <div className="text-lg font-bold mb-2">聯絡資訊</div>
                    <div className="mb-1">院址：台灣省台中市西屯區幸福路123號</div>
                    <div className="mb-1">總機電話：(04) 1234-5678</div>
                    <div className="mb-1">掛號專線：(04) 8765-4321</div>
                    <div className="mb-1">服務信箱：service@chiuhospital.fake</div>
                    <div className="mt-4 text-sm text-gray-400">本頁資訊僅供展示，非真實醫療機構</div>
                </div>
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