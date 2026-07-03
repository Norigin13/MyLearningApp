function Header({ userName, searchQuery, onSearch, onNew }) {
  return (
    <header className="mb-7 flex flex-wrap items-start justify-between gap-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-800">
          Xin chào, {userName}! <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Chào mừng trở lại bảng điều khiển học tập của bạn.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="w-60 rounded-[10px] border border-slate-200 bg-white py-[11px] pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-600 focus:ring-[3px] focus:ring-violet-600/10 max-md:w-full"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="whitespace-nowrap rounded-[10px] bg-violet-600 px-[22px] py-[11px] text-sm font-semibold text-white transition-colors hover:bg-violet-700"
          onClick={onNew}
        >
          + Mới
        </button>
      </div>
    </header>
  );
}

export default Header;
