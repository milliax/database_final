import Image from "next/image";
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
                    <a href="#">醫療團隊</a>
                </nav>
            </div>

            {/* Image Banner */}
            <div className="w-full h-[40rem] bg-cover bg-center">
                {/* Image slider dots if needed */}
                <Image src="/images/hosp.jpg"
                    alt="chiu hospital"
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
          */ 
            </div>
    
    );
}