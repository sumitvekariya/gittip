import NextAuth from "next-auth"
import GithbProvider from "next-auth/providers/github"

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithbProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
})

export { handler as GET, handler as POST }