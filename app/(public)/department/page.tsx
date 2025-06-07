import Link from "next/link";

export default function DepartmentPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-center my-8">科別列表</h1>
            <div className="flex flex-col items-center gap-6 mt-8">
                <Link
                    href="/doctors"
                    className="block w-64 px-6 py-4 bg-green-100 rounded-lg shadow hover:bg-green-200 text-center text-xl font-semibold text-green-800 transition"
                >
                    內科
                </Link>
                <div className="block w-64 px-6 py-4 bg-blue-100 rounded-lg shadow text-center text-xl font-semibold text-blue-800">
                    外科
                </div>
                <div className="block w-64 px-6 py-4 bg-yellow-100 rounded-lg shadow text-center text-xl font-semibold text-yellow-800">
                    小兒科
                </div>
            </div>
        </div>
    );
}