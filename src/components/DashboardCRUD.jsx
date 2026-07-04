import { useState, useMemo, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";

function DashboardCRUD() {
  const { data, updateStudyLessons } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Programming",
    status: "learning",
    score: "",
    studyTime: "",
    day: "",
    time: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);

  const lessons = useMemo(() => {
    if (!data.activities) return [];
    return data.activities.filter((a) => a.type === "lesson");
  }, [data.activities]);

  useEffect(() => {
    setPage(1);
  }, [lessons.length]);

  const pageSize = 6;
  const total = lessons.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;

  const paginatedLessons = useMemo(() => {
    return lessons.slice(start, start + pageSize);
  }, [lessons, start]);

  const handleOpenAdd = () => {
    setError("");
    setEditingId(null);
    const now = new Date();
    const currentDay = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0].substring(0, 5);

    setFormData({
      title: "",
      category: "Programming",
      status: "learning",
      score: "0",
      studyTime: "30",
      day: currentDay,
      time: currentTime,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (lesson) => {
    setError("");
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title || "",
      category: lesson.category || "Programming",
      status: lesson.status || "learning",
      score: String(lesson.score || "0"),
      studyTime: String(lesson.studyTime || "30"),
      day: lesson.day || "",
      time: lesson.time || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài học này không?")) return;
    setIsSubmitting(true);
    try {
      const updated = lessons.filter((l) => String(l.id) !== String(id));
      await updateStudyLessons(updated);
    } catch (err) {
      alert(err.message || "Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề bài học.");
      return;
    }
    if (!formData.day || !formData.time) {
      setError("Vui lòng điền ngày và giờ học.");
      return;
    }
    if (formData.status === "completed" && (isNaN(formData.score) || Number(formData.score) < 0 || Number(formData.score) > 10)) {
      setError("Điểm số phải là số từ 0 đến 10.");
      return;
    }
    if (isNaN(formData.studyTime) || Number(formData.studyTime) <= 0) {
      setError("Thời gian học phải là số nguyên dương lớn hơn 0 phút.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let updated;
      if (editingId) {
        // Edit mode
        updated = lessons.map((l) => {
          if (String(l.id) === String(editingId)) {
            return {
              ...l,
              title: formData.title,
              category: formData.category,
              status: formData.status,
              score: formData.status === "completed" ? Number(formData.score) : 0,
              studyTime: Number(formData.studyTime),
              day: formData.day,
              time: formData.time,
            };
          }
          return l;
        });
      } else {
        // Add mode
        const newLesson = {
          id: String(Date.now()),
          title: formData.title,
          type: "lesson",
          category: formData.category,
          score: formData.status === "completed" ? Number(formData.score) : 0,
          status: formData.status,
          studyTime: Number(formData.studyTime),
          day: formData.day,
          time: formData.time,
        };
        updated = [...lessons, newLesson];
      }

      await updateStudyLessons(updated);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message || "Đồng bộ thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý Chương trình</h1>
          <p className="text-sm text-slate-500 mt-1">
            Thêm mới, sửa đổi hoặc xóa các bài học trong tiến độ học tập thực tế trên MockAPI.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          <FiPlus className="h-5 w-5" />
          <span>Thêm bài học mới</span>
        </button>
      </div>

      {/* CRUD Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Bài học</th>
                <th className="px-6 py-4">Thể loại</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Thời lượng học</th>
                <th className="px-6 py-4">Điểm</th>
                <th className="px-6 py-4">Thời gian lưu</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedLessons.length > 0 ? (
                paginatedLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{lesson.title}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{lesson.category}</td>
                    <td className="px-6 py-4">
                      {lesson.status === "completed" ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit border border-emerald-100">
                          <FiCheckCircle className="h-3.5 w-3.5" /> Hoàn thành
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit border border-amber-100">
                          <FiClock className="h-3.5 w-3.5" /> Đang học
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{lesson.studyTime} phút</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">
                      {lesson.status === "completed" ? `${lesson.score}/10` : "-"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {lesson.day} {lesson.time}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(lesson)}
                          disabled={isSubmitting}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-violet-600 transition-colors cursor-pointer disabled:opacity-50"
                          title="Sửa"
                        >
                          <FiEdit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(lesson.id)}
                          disabled={isSubmitting}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                          title="Xóa"
                        >
                          <FiTrash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Chưa có bài học nào trong danh sách.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {/* Slide-over / Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Form Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Cập nhật bài học" : "Tạo bài học mới"}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-600">
                  <FiAlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tiêu đề bài học
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Học cấu trúc dữ liệu..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-600 focus:bg-white"
                />
              </div>

              {/* Grid 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Thể loại
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none focus:border-violet-600 focus:bg-white"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Language">Language</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                {/* Status select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none focus:border-violet-600 focus:bg-white"
                  >
                    <option value="learning">Đang học</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>
              </div>

              {/* Grid 2 columns for score and studyTime */}
              <div className="grid grid-cols-2 gap-4">
                {/* Study Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Thời gian học (phút)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.studyTime}
                    onChange={(e) => setFormData({ ...formData, studyTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-600 focus:bg-white"
                  />
                </div>

                {/* Score */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Điểm số (0 - 10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    disabled={formData.status !== "completed"}
                    value={formData.status === "completed" ? formData.score : "0"}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-600 focus:bg-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Grid 2 columns for Day and Time */}
              <div className="grid grid-cols-2 gap-4">
                {/* Day */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Ngày lưu học
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-600 focus:bg-white"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Giờ lưu học
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <FiSave className="h-4.5 w-4.5" />
                  <span>{isSubmitting ? "Đang đồng bộ..." : "Lưu dữ liệu"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCRUD;
