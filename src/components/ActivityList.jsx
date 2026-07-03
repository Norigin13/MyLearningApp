import { useMemo, useState, useEffect } from "react";
import { FiBook, FiFileText, FiUserPlus } from "react-icons/fi";

const activityIcons = {
  lesson: <FiBook className="h-5 w-5" />,
  submit: <FiFileText className="h-5 w-5" />,
  enroll: <FiUserPlus className="h-5 w-5" />,
};

const colorClasses = {
  purple: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-500",
  amber: "bg-amber-50 text-amber-500",
  green: "bg-emerald-50 text-emerald-500",
};

function formatActivityText(a) {
  if (!a) return "";
  const title = a.title || "";
  const course = a.course || a.category || "";
  if (a.type === "lesson") {
    if (a.status === "completed")
      return `Hoàn thành bài "${title}" — Khóa học: ${course}`;
    if (a.status === "learning")
      return `Đang học: "${title}" — Khóa học: ${course}`;
    if (a.status === "not_started")
      return `Chưa bắt đầu: "${title}" — Khóa học: ${course}`;
    return `${title} — Khóa học: ${course}`;
  }
  if (a.type === "submit") {
    if (a.status === "submitted")
      return `Bạn đã nộp "${title}" — Khóa học: ${course}`;
    return `Nộp bài: "${title}" — Khóa học: ${course}`;
  }
  if (a.type === "enroll") {
    if (a.status === "enrolled") return `Bạn đã đăng ký khóa "${title}"`;
    return `Đăng ký: "${title}"`;
  }
  return title;
}

function parseDateTime(a) {
  // a.day YYYY-MM-DD, a.time HH:mm
  if (!a) return 0;
  const day = a.day || "";
  const time = a.time || "";
  if (!day && !time) return 0;
  const iso = time ? `${day}T${time}:00` : `${day}T00:00:00`;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : t;
}

function ActivityList({ activities = [], searchQuery }) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    return (activities || [])
      .slice()
      .sort((a, b) => {
        const priority = (item) => {
          if (item.type === "lesson" && item.status === "learning") return 0;
          if (item.type === "lesson" && item.status === "completed") return 1;
          return 2;
        };
        const pa = priority(a);
        const pb = priority(b);
        if (pa !== pb) return pa - pb;
        return parseDateTime(b) - parseDateTime(a) || b.id - a.id;
      })
      .filter((activity) => {
        if (!q) return true;
        const text = (activity.title || "").toLowerCase();
        const formatted = formatActivityText(activity).toLowerCase();
        return text.includes(q) || formatted.includes(q);
      });
  }, [activities, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activities]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(pages, p + 1));

  return (
    <article className="rounded-[14px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-[17px] font-semibold text-slate-800">
        Hoạt động gần đây
      </h2>

      <ul className="flex flex-col gap-1">
        {pageItems.length > 0 ? (
          pageItems.map((activity) => (
            <li
              key={activity.id}
              className="flex items-center gap-3.5 rounded-[10px] px-2 py-3 transition-colors hover:bg-slate-100"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-base ${
                  colorClasses[activity.color] || "bg-slate-100 text-slate-600"
                }`}
              >
                {activityIcons[activity.type] || "•"}
              </span>
              <div>
                <p className="text-sm font-medium leading-snug text-slate-800">
                  {formatActivityText(activity)}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {activity.displayTime || activity.time || activity.day || ""}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="px-2 py-3 text-sm text-slate-500">
            Không có hoạt động
          </li>
        )}
      </ul>

      {total > pageSize && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={current <= 1}
            className="rounded-md px-3 py-1 text-sm text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Trang trước
          </button>
          <div className="text-sm text-slate-500">
            {current} / {pages}
          </div>
          <button
            onClick={handleNext}
            disabled={current >= pages}
            className="rounded-md px-3 py-1 text-sm text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Trang sau
          </button>
        </div>
      )}
    </article>
  );
}
export default ActivityList;
