import { useEffect, useState } from 'react';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cookies, STORAGE_KEYS } from '../storage';
import { loginUser } from '../service/login.api';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const authToken = cookies.get(STORAGE_KEYS.AUTH_TOKEN);
        console.log(authToken);

        if (authToken) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response: any = await loginUser({
                username,
                password,
            });
            if (response.code === 200) {
                // Store auth token in cookie (backend nests it inside 'data')
                cookies.set(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
                
                navigate("/");

                toast.success(
                    `Hi, ${response.data?.userCheck?.firstName || ""} ${response.data?.userCheck?.lastName || ""}`
                );
            } else throw response;
        } catch (err: any) {
            console.error("Login error:", err);
            // toast.error(err.response.data.message ||'An error occurred. Please try again.');
            setError(
                err?.response?.data?.message || "An error occurred. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                        <FiLock className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-6 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 font-medium">Sign in to your AuthGuard account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <FiUser className="text-lg" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <FiLock className="text-lg" />
                            </div>
                            <input
                                type="password"
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Sign In
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-gray-500">
                    Don't have an account?{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">
                        Contact administrator
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;