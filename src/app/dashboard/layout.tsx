// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth.config";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin"); // or redirect to "/login" if you have a custom page
  }

  return (
    <section>
      {/* You can add your dashboard sidebar/navbar here */}
      {children}
    </section>
  );
}
