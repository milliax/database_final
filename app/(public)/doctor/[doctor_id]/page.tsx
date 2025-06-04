

export default async function DoctorDetailPage({ params }: { params: Promise<{ doctor_id: string }> }) {
    return(
        <div>
            <h1 className="text-2xl font-bold text-center my-8">醫生詳細資訊</h1>
            <p className="text-center text-gray-600">這裡將顯示醫生的詳細資訊，ID: {(await params).doctor_id}</p>
            {/* 這裡可以放置更多的醫生詳細資訊內容 */}

            <div >

            </div>
        </div>
    )
}