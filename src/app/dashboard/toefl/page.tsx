import {
  FiPlayCircle,
  FiBookOpen,
  FiHeadphones,
  FiList,
  FiTrendingUp,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";

export default function ToeflSimulationDashboard() {
  const items = [
    {
      title: "Full TOEFL Simulation",
      desc: "Complete test: Listening, Structure, and Reading.",
      icon: <FiPlayCircle className="w-8 h-8 text-blue-600" />,
      href: "/dashboard/toefl/simulation?mode=full",
      border: "border-blue-200",
      bg: "hover:bg-blue-50",
    },
    {
      title: "Listening Simulation",
      desc: "Practice Listening Comprehension with audio questions.",
      icon: <FiHeadphones className="w-8 h-8 text-purple-600" />,
      href: "/dashboard/toefl/simulation?mode=listening",
      border: "border-purple-200",
      bg: "hover:bg-purple-50",
    },
    {
      title: "Structure & Written Expression",
      desc: "Practice grammar and written expression questions.",
      icon: <FiList className="w-8 h-8 text-green-600" />,
      href: "/dashboard/toefl/simulation?mode=structure",
      border: "border-green-200",
      bg: "hover:bg-green-50",
    },
    {
      title: "Reading Simulation",
      desc: "Practice reading passages with academic questions.",
      icon: <FiBookOpen className="w-8 h-8 text-red-600" />,
      href: "/dashboard/toefl/simulation?mode=reading",
      border: "border-red-200",
      bg: "hover:bg-red-50",
    },
    {
      title: "Score History",
      desc: "Track your performance and improvement over time.",
      icon: <FiTrendingUp className="w-8 h-8 text-yellow-600" />,
      href: "/dashboard/toefl/simulation/history",
      border: "border-yellow-200",
      bg: "hover:bg-yellow-50",
    },
  ];

  return (
    <div className="px-6 py-10 bg-gray-100 min-h-screen">

      {/* 🔙 BACK BUTTON */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        TOEFL Practice Simulation
      </h1>

      <p className="text-gray-600 mb-10 max-w-3xl">
        Practice TOEFL questions interactively and track your performance.
        Choose a simulation mode to begin.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link key={item.title} href={item.href}>
            <div
              className={`
                cursor-pointer rounded-xl bg-white border ${item.border}
                shadow-sm hover:shadow-md transition p-6 flex flex-col gap-4
                ${item.bg}
              `}
            >
              <div>{item.icon}</div>
              <div className="font-semibold text-lg text-gray-800">
                {item.title}
              </div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
