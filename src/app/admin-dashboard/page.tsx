import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth.config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FiUsers, FiFileText, FiTool, FiCalendar } from "react-icons/fi";

export default async function DashboardAdminPage() {
  const session = await getServerSession(authOptions);

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
      color: "from-blue-50 to-blue-100",
      disabled: false,
    },
    {
      title: "TOEFL Editor",
      description: "Manage TOEFL materials.",
      href: "/admin-dashboard/toefl",
      icon: <FiTool className="w-6 h-6 text-yellow-600" />,
      color: "from-yellow-50 to-yellow-100",
      disabled: false,
    },
    {
      title: "Edit Lecturers",
      description: "Manage lecturer database.",
      href: "/admin-dashboard/lecturers",
      icon: <FiFileText className="w-6 h-6 text-indigo-600" />,
      color: "from-indigo-50 to-indigo-100",
      disabled: false,
    },
    {
      title: "Tools",
      description: "Internal utilities.",
      href: "/admin-dashboard/tools",
      icon: <FiTool className="w-6 h-6 text-rose-600" />,
      color: "from-rose-50 to-rose-100",
      disabled: true,
    },
    {
      title: "Events",
      description: "Create and manage events.",
      href: "/admin-dashboard/events",
      icon: <FiCalendar className="w-6 h-6 text-purple-600" />,
      color: "from-purple-50 to-purple-100",
      disabled: true,
    },
    {
      title: "News Editor",
      description: "Create and manage announcements.",
      href: "/admin-dashboard/news",
      icon: <FiFileText className="w-6 h-6 text-green-600" />,
      color: "from-green-50 to-green-100",
      disabled: true,
    }, 
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Welcome Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200 p-8">
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hello, {session.user?.name}
            </span>{" "}
            👋
          </h1>

          <p className="mt-2 text-slate-600 text-lg">
            Welcome to the Admin Dashboard.
          </p>

          <div className="mt-3 text-sm text-slate-500">
            Logged in as{" "}
            <span className="font-medium text-slate-700">
              {session.user?.email}
            </span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center mt-6 px-5 py-2.5 rounded-md text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 transition shadow-md hover:shadow-lg"
          >
            ← Back to Member Dashboard
          </Link>
        </div>

        {/* Tools Section */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Admin Menu
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ title, description, href, icon, color, disabled }) => (
              <div
                key={href}
                className={`
                  group relative rounded-xl border border-slate-200 
                  bg-gradient-to-br ${color} 
                  p-6 shadow-md transition overflow-hidden
                  ${disabled
                    ? "opacity-60 cursor-default"
                    : "hover:shadow-xl hover:-translate-y-1 cursor-pointer"}
                `}
              >
                {/* Hover Overlay for Disabled */}
                {disabled && (
                  <div
                    className="
                      absolute inset-0 bg-black/70
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                      pointer-events-none
                      flex items-center px-6 z-20
                    "
                  >
                    <FiTool className="w-10 h-10 text-white opacity-90 mr-4" />

                    <span className="text-white text-lg font-semibold tracking-wide">
                      THIS MENU IS UNDER CONSTRUCTION
                    </span>
                  </div>
                )}

                <Link
                  href={disabled ? "#" : href}
                  className={disabled ? "pointer-events-none" : ""}
                >
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 rounded-lg bg-white shadow-sm">
                      {icon}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
