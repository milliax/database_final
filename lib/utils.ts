import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const numberInLetter = (num: number) => {
    switch (num) {
        case 0:
            return "一";
        case 1:
            return "二";
        case 2:
            return "三";
        case 3:
            return "四";
        case 4:
            return "五";
        case 5:
            return "六";
        case 6:
            return "日";
        default:
            return "";
    }
}