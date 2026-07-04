function Header({ userName }) {
  return (
    <header className="mb-7">
      <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-800">
        Xin chào, {userName}! <span aria-hidden="true">👋</span>
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Chào mừng trở lại bảng điều khiển học tập của bạn.
      </p>
    </header>
  );
}

export default Header;
