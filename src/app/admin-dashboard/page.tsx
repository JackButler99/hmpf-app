import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FiUsers, FiFileText, FiTool, FiCalendar } from "react-icons/fi";

export default async function DashboardAdminPage() {
  const session = await getServerSession(authOptions);

  // Protect route: only admins or editors can access
  const isPrivileged =
    session?.user?.isAdmin === true || session?.user?.isEditor === true;

  if (!session || !isPrivileged) {
    redirect("/dashboard");
  }

  const tools = [
    {
      title: "Member Directory",
      description: "View and manage all registered members.",
      href: "/admin-dashboard/members",
      icon: <FiUsers className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "News Editor",
      description: "Create and manage organizational announcements.",
      href: "/admin-dashboard/news",
      icon: <FiFileText className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Edit Lecturers",
      description: "Create and manage organizational announcements.",
      href: "/admin-dashboard/lecturers",
      icon: <FiFileText className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Tools",
      description: "Access internal utilities and tools.",
      href: "/admin-dashboard/tools",
      icon: <FiTool className="w-6 h-6 text-yellow-600" />,
    },
    {
      title: "Events",
      description: "Create and track upcoming events.",
      href: "/admin-dashboard/events",
      icon: <FiCalendar className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Toefl Editor",
      description: "Manage the content on TOEFL App.",
      href: "/admin-dashboard/toefl",
      icon: <FiTool className="w-6 h-6 text-yellow-600" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome, {session.user?.name} 👋
          </h1>
          <p className="text-gray-600 text-md">
            Logged in as{" "}
            <span className="font-medium text-blue-600">
              {session.user?.email}
            </span>
          </p>

          <Link
            href="/dashboard"
            className="inline-block mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            ← Back to Member Dashboard
          </Link>
        </div>

        <section>
          <h2 className="text-2xl text-gray-900 font-semibold mb-4">Admin Dashboard</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {tools.map(({ title, description, href, icon }) => (
              <Link
                key={href}
                href={href}
                className="bg-white hover:bg-gray-100 border rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <p className="text-gray-600 mt-1 text-sm">{description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
