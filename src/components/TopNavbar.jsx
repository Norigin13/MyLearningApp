import { useAppContext } from "../context/AppContext";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiBell,
  FiBookOpen,
  FiCheckCircle,
  FiMessageCircle,
  FiAlertCircle,
  FiBell as FiBellOutline,
} from "react-icons/fi";

function TopNavbar() {
  const { data, activeTopNav, setActiveTopNav, logout, searchQuery, handleSearch } = useAppContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const profileRef = useRef(null);
  const bellRef = useRef(null);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "course":
        return <FiBookOpen className="h-4 w-4 text-sky-500" />;
      case "success":
      case "completed":
        return <FiCheckCircle className="h-4 w-4 text-emerald-500" />;
      case "message":
      case "chat":
        return <FiMessageCircle className="h-4 w-4 text-violet-500" />;
      case "alert":
      case "warning":
        return <FiAlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <FiBellOutline className="h-4 w-4 text-slate-500" />;
    }
  };

  useEffect(() => {
    const onDoc = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target))
        setBellOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between bg-indigo-950 px-8 text-white max-md:h-auto max-md:flex-wrap max-md:gap-3 max-md:px-4 max-md:py-3">
      <div className="flex min-w-[140px] items-center gap-2.5">
        <span className="flex h-8 w-8" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
            <path
              d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"
              fill="url(#cubeGrad)"
            />
            <path
              d="M12 2V22M2 8.5L22 15.5M22 8.5L2 15.5"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.8"
            />
            <defs>
              <linearGradient id="cubeGrad" x1="2" y1="2" x2="22" y2="22">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="text-lg font-semibold tracking-tight">MyApp</span>
      </div>

      <nav className="flex items-center gap-1.5 max-md:order-3 max-md:w-full max-md:overflow-x-auto">
        {data.topNavItems.map((item) => (
          <button
            key={item}
            type="button"
            className={`rounded-full px-[18px] py-2 text-sm font-medium transition-all ${activeTopNav === item
                ? "bg-violet-600 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            onClick={() => setActiveTopNav(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="relative flex items-center justify-end gap-4 max-md:w-full">
        {/* Search Bar */}
        <div className="relative max-md:w-full">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="w-36 transition-all duration-300 md:w-48 focus:w-48 focus:md:w-72 rounded-lg border border-white/10 bg-white/10 py-1.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/40 focus:border-violet-500 focus:bg-white/20 focus:ring-2 focus:ring-violet-500/20 max-md:w-full"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="relative" ref={bellRef}>
          <button
            type="button"
            onClick={() => {
              setBellOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10"
            aria-label="Thông báo"
          >
            <FiBell className="h-5 w-5" />
            {data.notifications?.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute right-0 top-0 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white py-2 shadow-lg text-slate-800">
              <div className="px-4 pb-2 pt-3 text-sm font-medium">
                Thông báo mới
              </div>
              <div className="max-h-60 overflow-y-auto px-2">
                {data.notifications && data.notifications.length > 0 ? (
                  data.notifications
                    .slice()
                    .sort((a, b) => {
                      const da = Date.parse(a.createdAt || "") || 0;
                      const db = Date.parse(b.createdAt || "") || 0;
                      return db - da;
                    })
                    .slice(0, 5)
                    .map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        className="flex w-full flex-col items-start gap-1 rounded-lg px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <div className="flex w-full items-start gap-3">
                          <span className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-900">
                              {notification.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {notification.message}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {notification.createdAt}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    Không có thông báo mới
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setBellOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/10"
            aria-label="Menu hồ sơ"
          >
            {data.profile?.avatar ? (
              <img
                src={data.profile.avatar}
                alt={data.profile?.fullname || data.userName}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = null;
                }}
                className="h-[34px] w-[34px] rounded-full object-cover"
              />
            ) : (
              <span className="h-[34px] w-[34px] inline-flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-[13px] font-semibold">
                {String(
                  (data.profile?.fullname || data.userName || "U")[0],
                ).toUpperCase()}
              </span>
            )}
            <div className="hidden flex-col text-left max-md:hidden">
              <div className="text-sm font-medium">
                {data.profile?.fullname || data.userName}
              </div>
              <div className="text-xs text-white/70">
                {data.profile?.role || ""}
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-white/60"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg text-slate-800">
              <div className="flex items-center gap-3 px-4 py-3">
                {data.profile?.avatar ? (
                  <img
                    src={data.profile.avatar}
                    alt="avatar"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    {String(
                      (data.profile?.fullname || data.userName || "U")[0],
                    ).toUpperCase()}
                  </span>
                )}
                <div>
                  <div className="font-medium">
                    {data.profile?.fullname || data.userName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {data.profile?.role || ""}
                  </div>
                </div>
              </div>
              <hr />
              <ul className="py-2">
                <li>
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">
                    <span>👤</span>
                    Hồ sơ cá nhân
                  </button>
                </li>
                <li>
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">
                    <span>⚙️</span>
                    Cài đặt
                  </button>
                </li>
                <li>
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">
                    <span>🔔</span>
                    Thông báo
                  </button>
                </li>
                <li>
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">
                    <span>❓</span>
                    Trợ giúp
                  </button>
                </li>
              </ul>
              <div className="px-4 py-2">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  <span>⎋</span>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
