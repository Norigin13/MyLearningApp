import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { FiMail, FiUser, FiCalendar, FiBookOpen, FiAward, FiClock, FiHeart, FiMessageSquare, FiShare2 } from "react-icons/fi";

function Profile() {
  const { data } = useAppContext();

  const profile = data.profile || {
    fullname: "Chưa cập nhật",
    email: "email@gmail.com",
    role: "student",
    id: "N/A",
    avatar: "",
  };

  const lessons = useMemo(() => {
    if (!data.activities) return [];
    return data.activities.filter((a) => a.type === "lesson");
  }, [data.activities]);

  const stats = useMemo(() => {
    const total = lessons.length;
    const completed = lessons.filter((l) => l.status === "completed").length;
    const learning = total - completed;
    const totalMinutes = lessons.reduce((sum, l) => sum + Number(l.studyTime || 0), 0);
    const hours = (totalMinutes / 60).toFixed(1);
    const scoreSum = lessons.filter((l) => l.status === "completed").reduce((sum, l) => sum + Number(l.score || 0), 0);
    const avgScore = completed ? (scoreSum / completed).toFixed(1) : "0";
    return { total, completed, learning, hours, avgScore };
  }, [lessons]);

  const sortedLessons = useMemo(() => {
    return lessons.slice().sort((a, b) => {
      const dateA = new Date(`${a.day}T${a.time || "00:00"}`);
      const dateB = new Date(`${b.day}T${b.time || "00:00"}`);
      return dateB - dateA;
    });
  }, [lessons]);

  const recentLessons = useMemo(() => {
    return sortedLessons.slice(0, 3);
  }, [sortedLessons]);

  const olderLessons = useMemo(() => {
    return sortedLessons.slice(3);
  }, [sortedLessons]);

  return (
    <div className="flex-1 space-y-6 pb-16">
      {/* Facebook Cover & Avatar Area */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-48 w-full bg-gradient-to-r from-indigo-800 via-purple-800 to-violet-950">
          {/* Abstract background graphics */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute bottom-4 right-6 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            Học tập trọn đời
          </div>
        </div>

        {/* Profile Info Row (Overlap Cover) */}
        <div className="relative px-6 pb-6 pt-16 sm:pt-4 flex flex-col sm:flex-row items-center sm:items-end gap-5">
          {/* Avatar (overlapping cover) */}
          <div className="absolute -top-16 left-6 sm:left-8 h-32 w-32 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.fullname}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="h-full w-full inline-flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-500 text-3xl font-bold text-white uppercase">
                {String(profile.fullname || "U")[0]}
              </span>
            )}
          </div>

          {/* Spacer for avatar overlap space on desktop */}
          <div className="hidden sm:block w-32 shrink-0" aria-hidden="true" />

          {/* User Basic Info */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center justify-center sm:justify-start gap-2">
              {profile.fullname}
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                Tài khoản đã xác thực
              </span>
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <FiUser className="h-4 w-4" /> Student
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FiMail className="h-4 w-4" /> {profile.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Facebook Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Intro / About */}
        <div className="lg:col-span-4 space-y-6">
          {/* Intro Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Giới thiệu</h3>
            
            <p className="text-xs font-medium text-slate-600 italic border-l-2 border-violet-500 pl-3">
              "Quyết tâm hoàn thành tất cả các khóa học lập trình và thiết kế để chuẩn bị cho các dự án thực tế trong tương lai."
            </p>

            <div className="space-y-3 text-xs font-semibold text-slate-600 pt-2">
              <div className="flex items-center gap-2">
                <FiUser className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Mã số học sinh: <strong className="text-slate-800">{profile.id}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Email chính: <strong className="text-slate-800">{profile.email}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Thành viên từ: <strong className="text-slate-800">Tháng 07, 2026</strong></span>
              </div>
            </div>
          </div>

          {/* Stats Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Thống kê học tập</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Hoàn thành</div>
                <div className="text-xl font-bold text-slate-800 mt-0.5">{stats.completed} bài</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Đang học</div>
                <div className="text-xl font-bold text-slate-800 mt-0.5">{stats.learning} bài</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Thời lượng</div>
                <div className="text-xl font-bold text-slate-800 mt-0.5">{stats.hours}h</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Điểm TB</div>
                <div className="text-xl font-bold text-violet-600 mt-0.5">{stats.avgScore}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline / Activities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Post/Timeline Area Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-800">Dòng thời gian hoạt động</div>
          </div>

          {/* Timeline Feed Posts */}
          {recentLessons.length > 0 ? (
            <>
              {recentLessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  {/* Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          <span className="h-full w-full inline-flex items-center justify-center bg-violet-600 text-white font-bold uppercase text-sm">
                            {String(profile.fullname)[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          {profile.fullname}
                          <span className="text-xs text-slate-400 font-normal">đã cập nhật tiến độ học tập</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {lesson.day} lúc {lesson.time}
                        </div>
                      </div>
                    </div>

                    <span className={`rounded-md border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      lesson.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-150" : "bg-amber-50 text-amber-600 border-amber-150"
                    }`}>
                      {lesson.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-3 pt-1">
                    <h4 className="text-base font-bold text-slate-800 leading-snug">
                      {lesson.status === "completed" ? (
                        <>🎉 Đã hoàn thành xuất sắc bài học: <span className="text-violet-600 font-extrabold">"{lesson.title}"</span></>
                      ) : (
                        <>📖 Đang tiến hành học bài: <span className="text-amber-600 font-extrabold">"{lesson.title}"</span></>
                      )}
                    </h4>

                    {/* Attachment Box */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          lesson.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {lesson.status === "completed" ? <FiAward className="h-5.5 w-5.5" /> : <FiBookOpen className="h-5.5 w-5.5" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{lesson.title}</div>
                          <div className="text-xs text-slate-500 font-medium">Thời gian tự học: {lesson.studyTime} phút</div>
                        </div>
                      </div>
                      {lesson.status === "completed" && (
                        <div className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-600/10">
                          Đạt điểm: {lesson.score}/10
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Actions (For FB feel) */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-red-500 transition-colors cursor-pointer">
                      <FiHeart className="h-4.5 w-4.5" /> Thích
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-blue-500 transition-colors cursor-pointer">
                      <FiMessageSquare className="h-4.5 w-4.5" /> Bình luận
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-indigo-500 transition-colors cursor-pointer">
                      <FiShare2 className="h-4.5 w-4.5" /> Chia sẻ
                    </button>
                  </div>
                </div>
              ))}

              {/* Older Activities List View */}
              {olderLessons.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                    Các hoạt động học tập cũ hơn
                  </h4>
                  <ul className="divide-y divide-slate-100">
                    {olderLessons.map((lesson) => (
                      <li key={lesson.id} className="py-3.5 flex items-center justify-between text-sm hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            lesson.status === "completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50" : "bg-amber-50 text-amber-600 border border-amber-200/50"
                          }`}>
                            {lesson.status === "completed" ? <FiAward className="h-4 w-4" /> : <FiBookOpen className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-xs sm:text-sm">{lesson.title}</div>
                            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {lesson.day} lúc {lesson.time} • <span className="uppercase">{lesson.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right shrink-0">
                          {lesson.status === "completed" ? (
                            <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md border border-violet-100/50">
                              Điểm: {lesson.score}
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100/50">
                              {lesson.studyTime} phút
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
              Dòng thời gian chưa có hoạt động nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
