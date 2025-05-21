import NextAuth from "next-auth"

// export default NextAuth(authOptions)
import { authOptions } from "./auth";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }