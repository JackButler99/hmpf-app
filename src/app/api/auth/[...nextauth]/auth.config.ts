import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const email = user?.email || "";
      console.log("[SIGNIN] Attempting login with:", email);

      if (email.endsWith("@mail.ugm.ac.id") || email.endsWith("@ugm.ac.id")) {
        try {
          await connectToDB();

          let existingUser = await User.findOne({ email });

          if (!existingUser) {
            existingUser = await User.create({
              name: user.name,
              email,
              image: user.image,
              isAdmin: false,
              isEditor: false,
            });
          }

          return true;
        } catch (error) {
          console.error("[SIGNIN ERROR]:", error);
          throw new Error("Sign-in failed");
        }
      }

      console.warn("[SIGNIN] Email not allowed:", email);
      return false;
    },

    async session({ session }) {
      await connectToDB();

      if (session.user?.email) {
        const userInDb = await User.findOne({ email: session.user.email });

        if (userInDb) {
          session.user.id = userInDb._id;
          session.user.isAdmin = userInDb.isAdmin;
          session.user.isEditor = userInDb.isEditor;
        }
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth-error",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
