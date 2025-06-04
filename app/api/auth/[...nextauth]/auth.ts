import { AuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcrypt";

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                // const user = { id: 1, name: "J Smith", email: "" }
                if (!credentials) {
                    return null;
                }

                console.log("username: ", credentials.username);
                console.log("password", credentials.password);
                const encryptedPassword = await hash(credentials.password, 10);
                console.log("encryptedPassword", encryptedPassword);

                let user = await prisma.user.findUnique({
                    where: {
                        email: credentials.username,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        password: true,
                    }
                })

                // verify

                if (!user) {
                    return null;
                }

                const isPasswordMatch = await compare(credentials.password, user?.password ?? "");
                // console.log(isPasswordMatch)
                // await compare(credentials.password, encryptedPassword, async (err, result) => {
                //     console.log(result)
                //     if (err) {
                //         console.error(err)
                //     }
                // })

                if (isPasswordMatch) {
                    // Any object returned will be saved in `user` property of the JWT
                    // console.log("logged in user")
                    // console.log(user)

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    } as User;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null
                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {
            // console.log("session triggered")

            // session.user = user
            // session.accessToken = token.accessToken as string
            // @ts-ignore
            session.user.username = token.username
            // @ts-ignore
            session.user.role = token.role
            // session.user.accessToken = token.accessToken

            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            // console.log("jwt triggered")

            if (user) {
                token.role = user.role
                token.email = user.email
                token.id = user.id
                token.name = user.name
            }
            return token
        }
    },
    pages: {
        signIn: "/login"
    },
    debug: process.env.NODE_ENV === "development",
    // adapter: PrismaAdpter(prisma)
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
        strategy: "jwt",
    }
}