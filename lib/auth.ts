import { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    // 請根據你的專案設定 providers、callbacks 等
    providers: [],
    session: { strategy: "jwt" },
};