import { useState, useMemo, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { FiBookOpen, FiAward, FiClock, FiSearch, FiCheckCircle, FiPlayCircle, FiBook } from "react-icons/fi";

function Products() {
  const { data } = useAppContext();
  const [selectedCat, setSelectedCat] = useState("Tất cả");
  const [localSearch, setLocalSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [selectedCat, localSearch]);

  const lessons = useMemo(() => {
    if (!data.activities) return [];
    return data.activities.filter((a) => a.type === "lesson");
  }, [data.activities]);

  const categories = useMemo(() => {
    const list = lessons.map((l) => l.category || l.course).filter(Boolean);
    return ["Tất cả", ...Array.from(new Set(list))];
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      const matchCat = selectedCat === "Tất cả" || String(l.category).toLowerCase() === selectedCat.toLowerCase();
      const matchSearch = String(l.title).toLowerCase().includes(localSearch.toLowerCase()) || 
                          String(l.category).toLowerCase().includes(localSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [lessons, selectedCat, localSearch]);

  const pageSize = 6;
  const total = filteredLessons.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;

  const paginatedLessons = useMemo(() => {
    return filteredLessons.slice(start, start + pageSize);
  }, [filteredLessons, start]);

  const stats = useMemo(() => {
    const total = lessons.length;
    const completed = lessons.filter((l) => l.status === "completed").length;
    const learning = total - completed;
    const totalMinutes = lessons.reduce((sum, l) => sum + Number(l.studyTime || 0), 0);
    const hours = (totalMinutes / 60).toFixed(1);
    return { total, completed, learning, hours };
  }, [lessons]);

  const getCategoryColor = (category) => {
    switch (String(category).toLowerCase()) {
      case "programming":
      case "lập trình":
        return "from-violet-500/10 to-purple-500/10 text-purple-600 border-purple-500/20";
      case "design":
      case "thiết kế":
        return "from-sky-500/10 to-blue-500/10 text-sky-600 border-sky-500/20";
      case "language":
      case "ngôn ngữ":
        return "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20";
      default:
        return "from-slate-500/10 to-slate-600/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="flex-1 space-y-8 pb-12">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Sản phẩm Học tập</h1>
        <p className="text-sm text-slate-500 mt-1">Danh sách tất cả bài học trong chương trình đào tạo của bạn.</p>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FiBookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng số bài học</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <FiCheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{stats.completed}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Đã hoàn thành</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FiPlayCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{stats.learning}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Đang học</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <FiClock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{stats.hours}h</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Thời lượng học</div>
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-1.5 order-2 sm:order-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-600/25"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat === "Tất cả" ? "Tất cả danh mục" : cat}
            </button>
          ))}
        </div>

        {/* Local Search input */}
        <div className="relative w-full max-w-xs order-1 sm:order-2">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Tìm kiếm bài học..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-violet-600 focus:ring-2 focus:ring-violet-600/15"
          />
        </div>
      </div>

      {/* Grid of lessons */}
      {paginatedLessons.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedLessons.map((l) => (
              <div
                key={l.id}
                onClick={() => setSelectedLesson(l)}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Badge tags */}
                  <div className="flex items-center justify-between">
                    <span className={`rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${getCategoryColor(l.category)}`}>
                      {l.category}
                    </span>
                    
                    {l.status === "completed" ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">
                        <FiCheckCircle className="h-3 w-3" /> Hoàn thành
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full">
                        <FiClock className="h-3.5 w-3.5 animate-pulse" /> Đang học
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-violet-600 transition-colors">
                    {l.title}
                  </h3>
                </div>

                {/* Stats Footer of Card */}
                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <FiClock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{l.studyTime} phút học</span>
                  </div>
                  {l.status === "completed" && (
                    <div className="flex items-center gap-1 text-violet-600 font-semibold bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-md">
                      <FiAward className="h-3.5 w-3.5" />
                      <span>Điểm: {l.score}/10</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {total > pageSize && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current <= 1}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Trang trước
              </button>
              <div className="text-xs font-bold text-slate-500">
                Trang {current} / {pages}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={current >= pages}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <div className="rounded-full bg-slate-200/50 p-4 text-slate-400">
            <FiBook className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-700">Không tìm thấy bài học nào</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-xs">Hãy thử thay đổi danh mục bộ lọc hoặc gõ từ khóa tìm kiếm khác.</p>
        </div>
      )}

      {/* Zoom Lesson Details Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSelectedLesson(null)}>
          <div 
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Cover Header */}
            <div className="relative h-32 bg-gradient-to-r from-violet-600 to-indigo-750 p-6 flex flex-col justify-end">
              <button 
                type="button"
                onClick={() => setSelectedLesson(null)} 
                className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <span className={`w-fit rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white border-white/20`}>
                {selectedLesson.category}
              </span>
              <h2 className="text-xl font-bold text-white mt-2 leading-tight">
                {selectedLesson.title}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col items-center">
                  <FiClock className="h-6 w-6 text-slate-400 mb-1" />
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Thời gian học</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">{selectedLesson.studyTime} phút</div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col items-center">
                  {selectedLesson.status === "completed" ? (
                    <>
                      <FiAward className="h-6 w-6 text-violet-500 mb-1" />
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Điểm số đạt được</div>
                      <div className="text-lg font-bold text-violet-600 mt-1">{selectedLesson.score}/10</div>
                    </>
                  ) : (
                    <>
                      <FiPlayCircle className="h-6 w-6 text-amber-500 mb-1 animate-pulse" />
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</div>
                      <div className="text-lg font-bold text-amber-600 mt-1">Đang học</div>
                    </>
                  )}
                </div>
              </div>

              {/* Lesson Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Thông tin chi tiết bài học</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
                  Bài học này được lưu trữ vào hệ thống lúc <strong className="text-slate-800">{selectedLesson.time}</strong> ngày <strong className="text-slate-800">{selectedLesson.day}</strong>. Thuộc thể loại <strong className="text-slate-800">{selectedLesson.category}</strong>, bài học này cung cấp các kiến thức cốt lõi và nội dung thực hành chất lượng giúp nâng cao toàn diện kỹ năng chuyên môn của học sinh.
                </p>
              </div>

              {/* Close Button */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLesson(null)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
