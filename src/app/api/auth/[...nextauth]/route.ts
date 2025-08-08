import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@/lib/mongodb';  // Use the correct import path for your MongoDB connection
import User from '@/models/User';  // Adjust the import path based on your folder structure

// Exportable authOptions
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
  const email = user?.email || '';
  console.log('[SIGNIN] Attempting login with email:', email);

  if (email.endsWith("@mail.ugm.ac.id") || email.endsWith("@ugm.ac.id")) {
    try {
      await connectToDB();
      console.log('[SIGNIN] Connected to DB');

      let existingUser = await User.findOne({ email });
      console.log('[SIGNIN] Existing user:', existingUser);

      if (!existingUser) {
        console.log('[SIGNIN] Creating new user');
        existingUser = await User.create({
          name: user.name,
          email,
          image: user.image,
          isAdmin: false,
          isEditor: false,
        });
      }

      console.log('[SIGNIN] Sign-in success');
      return true;
    } catch (error) {
      console.error('[SIGNIN ERROR]', error);
      throw new Error('Sign-in failed');
    }
  }

  console.warn('[SIGNIN] Email not allowed:', email);
  return false;
    },
    async session({ session }) {
      // Ensure connection to the database
      await connectToDB();  // Use your existing connection method

      if (session.user?.email) {
        // Fetch the user from DB to populate additional fields in the session
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
  signIn: '/login',
  error: '/auth-error',
},

  secret: process.env.NEXTAUTH_SECRET,
};

// Initialize NextAuth with the options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
