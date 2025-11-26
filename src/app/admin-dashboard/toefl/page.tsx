// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import { redirect } from "next/navigation";
import ToeflAdminClient from "./ToeflAdminClient";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  const isPrivileged =
    session?.user?.isAdmin === true || session?.user?.isEditor === true;

  if (!session || !isPrivileged) {
    redirect("/dashboard");
  }

  return <ToeflAdminClient />;
}
