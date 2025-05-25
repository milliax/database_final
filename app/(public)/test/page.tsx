import Button from "@/components/button";

export default function Page() {

    return (
        <div>
            <h1 className="text-2xl font-bold">Test Page</h1>
            <p className="text-lg">This is a test page.</p>


            <span className="text-2xl font-bold">Hi</span>

            <img src="https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/E05/002/92/E050029285.jpg&v=5b15af5bk&w=375&h=375"
                alt="Logo"
                className="w-80 h-80 mb-4"></img>


            <input type="text" className="bg-red-100 outline-none" />

            <button>Click</button>

            <a href="" className="text-blue-500 hover:underline">
                link
            </a>

            <Button />
        </div>
    )
}