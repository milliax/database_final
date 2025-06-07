import clsx from "clsx";

export const LoadingCircle = ({
    color = "BLUE",
    scale = "MD",
    strokeWidth = 10,
}: {
    color?: "BLUE" | "PURPLE" | "ORANGE" | "RED",
    scale?: "XL" | "LG" | "MD" | "SM"
    strokeWidth?: number
}) => {
    const colorMap = {
        BLUE: "#3B82F6", // Tailwind blue-500
        PURPLE: "#8B5CF6", // Tailwind purple-500
        ORANGE: "#F97316", // Tailwind orange-500
        RED: "#EF4444", // Tailwind red-500
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {/* <svg
                className={clsx("animate-spin", {
                    "text-blue-500": color === "BLUE",
                    "text-purple-500": color === "PURPLE",
                    "text-orange-500": color === "ORANGE",
                    "text-red-500": color === "RED",
                }, {
                    "h-24 w-24": scale === "XL",
                    "h-20 w-20": scale === "LG",
                    "h-16 w-16": scale === "MD",
                    "h-12 w-12": scale === "SM",
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            > */}
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                // xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 367.136 367.136"
                strokeWidth={strokeWidth}
                className={clsx("animate-spin", {
                    // "text-blue-500": color === "BLUE",
                    // "text-purple-500": color === "PURPLE",
                    // "text-orange-500": color === "ORANGE",
                    // "text-red-500": color === "RED",
                }, {
                    "h-24 w-24": scale === "XL",
                    "h-20 w-20": scale === "LG",
                    "h-16 w-16": scale === "MD",
                    "h-12 w-12": scale === "SM",
                })}
                fill={colorMap[color]}
            // xml:space="preserve"
            >
                <path d="M336.954,87.494C318.821,59.1,293.251,36.318,263.01,21.613l-13.119,26.979c52.77,25.661,85.551,78.029,85.551,136.669
	c0,83.744-68.131,151.874-151.874,151.874S31.694,269.005,31.694,185.262c0-49.847,24.899-96.439,65.042-124.571L149.7,113.91V0
	H36.335l38.953,39.14C57.727,52.164,42.557,68.287,30.582,86.871c-18.898,29.33-28.888,63.352-28.888,98.391
	c0,100.286,81.588,181.874,181.874,181.874s181.874-81.588,181.874-181.874C365.442,150.485,355.59,116.678,336.954,87.494z"/>
            </svg>
            {/* </svg> */}
        </div>
    );
}