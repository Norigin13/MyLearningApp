import { FiBook, FiClipboard, FiStar, FiBarChart2 } from "react-icons/fi";

const statIcons = {
  courses: <FiBook className="h-8 w-8" />,
  projects: <FiClipboard className="h-8 w-8" />,
  points: <FiStar className="h-8 w-8" />,
  progress: <FiBarChart2 className="h-8 w-8" />,
};

const colorClasses = {
  green: "bg-emerald-50 text-emerald-500",
  teal: "bg-emerald-50 text-teal-500",
  blue: "bg-blue-50 text-blue-500",
  purple: "bg-violet-50 text-violet-500",
};

const arrowUp = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
  >
    <path d="M12 19V6" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

const arrowDown = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
  >
    <path d="M12 5v13" />
    <path d="M19 12l-7 7-7-7" />
  </svg>
);

function StatsCards({ stats }) {
  return (
    <section className="mb-6 grid grid-cols-6  gap-5 max-xl:grid-cols-2 max-sm:grid-cols-2">
      {stats.map((stat) => {
        const isUp =
          Number(String(stat.delta || 0).replace(/[^0-9\-\.]/g, "")) >= 0;
        return (
          <article
            key={stat.id}
            className="flex flex-col items-center gap-3 rounded-[14px] border border-slate-200 bg-white p-10 text-center shadow-sm"
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${colorClasses[stat.color]}`}
            >
              {statIcons[stat.icon]}
            </span>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold tracking-tight text-slate-800">
              {stat.value}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <span
                className={`${isUp ? "text-emerald-500" : "text-red-500"} inline-flex items-center`}
              >
                {isUp ? arrowUp : arrowDown}
              </span>
              <span
                className={`${isUp ? "text-emerald-600" : "text-red-600"} font-medium`}
              >
                {stat.delta}
              </span>
              <span className="text-[11px] text-slate-400">
                {stat.deltaLabel || "so với tuần trước"}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default StatsCards;
