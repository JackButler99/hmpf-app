import Hero from '../components/sections/Hero'
import { getServerSession } from 'next-auth'
import { AuthOptions } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/auth.config'
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // User is authenticated, redirect to protected page
    redirect("/dashboard");
  }

  return (
    <main>
      <Hero />
    </main>
  )
}
