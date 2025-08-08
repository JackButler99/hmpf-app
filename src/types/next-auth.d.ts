// src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";

// Extending NextAuth types to add custom fields to the session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;         // Add custom id field
      isAdmin: boolean;   // Add custom isAdmin field
      isEditor: boolean;  // Add custom isEditor field
    } & DefaultSession["user"];  // Keep all existing fields from DefaultSession["user"]
  }
}
