import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FiUsers, FiFileText, FiTool, FiCalendar } from "react-icons/fi";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const tools = [
    {
      title: "Lecturer Contacts",
      description: "Get your lecturer contacts.",
      href: "/dashboard/lecturers",
      icon: <FiUsers className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "TOEFL E-learning",
      description: "Learn TOEFL",
      href: "/dashboard/toefl",
      icon: <FiFileText className="w-6 h-6 text-green-600" />,
    },
    {
      title: "IELTS E-Learning",
      description: "Learn IELTS",
      href: "/dashboard/ielts",
      icon: <FiTool className="w-6 h-6 text-yellow-600" />,
    },
    {
      title: "Physics E-learning",
      description: "Learn Pyshics",
      href: "/dashboard/physics",
      icon: <FiCalendar className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Events",
      description: "Create and track upcoming events.",
      href: "/dashboard/events",
      icon: <FiCalendar className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Tools",
      description: "Access internal utilities and tools.",
      href: "/dashboard/tools",
      icon: <FiTool className="w-6 h-6 text-yellow-600" />,
    },
  ];

  const isPrivileged =
    session.user?.isAdmin === true || session.user?.isEditor === true;

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

          {isPrivileged && (
            <Link
              href="/admin-dashboard"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go to Admin Dashboard
            </Link>
          )}
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">My Dashboard</h2>
          <div className="grid gap-3 md:grid-cols-2 ">
            {tools.map(({ title, description, href, icon }) => (
              <Link
                key={href}
                href={href}
                className="bg-white border rounded-lg shadow-sm p-6 hover:bg-gray-100 hover:shadow-md transition"
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
