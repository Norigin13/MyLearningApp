import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiLogIn } from "react-icons/fi";

function Login() {
    const { login } = useAppContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            // Small artificial delay to show state changes beautifully (e.g. 800ms)
            await new Promise((resolve) => setTimeout(resolve, 800));
            await login(username, password);
        } catch (err) {
            setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
            {/* Background Decorative Glow Blobs */}
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]" />

            <div className="relative w-full max-w-md">
                {/* Logo and Brand Title */}
                <div className="mb-8 flex flex-col items-center justify-center text-center">
                    <span className="flex h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 p-2.5 shadow-lg shadow-violet-500/20">
                        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
                            <path
                                d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"
                                fill="currentColor"
                                className="text-white"
                            />
                            <path
                                d="M12 2V22M2 8.5L22 15.5M22 8.5L2 15.5"
                                stroke="rgba(0,0,0,0.15)"
                                strokeWidth="1"
                            />
                        </svg>
                    </span>
                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
                        MyLearningApp
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-400">
                        Nâng tầm tri thức, làm chủ tương lai
                    </p>
                </div>

                {/* Login Card */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-6">Đăng nhập vào tài khoản</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                                <FiAlertCircle className="h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                                    <FiUser className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                                    placeholder="Nhập tên đăng nhập (nguyen)"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                                    <FiLock className="h-5 w-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                                    placeholder="Nhập mật khẩu (1)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                                >
                                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot Password (visual details) */}
                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-white/10 bg-slate-950 accent-violet-600"
                                />
                                Ghi nhớ đăng nhập
                            </label>
                            <a href="#forgot" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
                                Quên mật khẩu?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] hover:shadow-violet-600/40 active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:shadow-none cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Đang đăng nhập...</span>
                                </>
                            ) : (
                                <>
                                    <FiLogIn className="h-5 w-5" />
                                    <span>Đăng nhập</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Login;
