import { connectToDatabase } from "@/lib/mongodb";
import NextAuth, { Account, Profile, User } from "next-auth"
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
  callbacks: {
    signIn: async ({user, account, profile, email, credentials}) => {
      console.log(user, account, profile)
      const profileData: any = profile;

      const userData = {...user, ...account, ...profile}
      try {
        const { db } = await connectToDatabase();

        const savedUser = await db.collection('users').updateOne(
          { login: profileData?.login }, // Use email as the unique identifier
          { $set: userData },
          { upsert: true });
          console.log(savedUser)
      } catch (error) {
        console.log(error) 
      }
      return Promise.resolve(true)
    },
    // session: ({session, user}) => {
    //   console.log(session, user)
    //   return Promise.resolve(session)
    // },
  }

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
})

export { handler as GET, handler as POST }