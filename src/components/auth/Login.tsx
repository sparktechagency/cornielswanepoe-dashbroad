import Cookies from "js-cookie"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useLoginAdminMutation } from "../../redux/features/auth/authApi"
import { Button } from "../ui/button"



export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [login,] = useLoginAdminMutation()
    const navigate = useNavigate()

    useEffect(() => {
        const email = Cookies.get("email");
        const password = Cookies.get("password");
        if (email && password) {
            setEmail(email);
            setPassword(password);
        }
    }, []);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (acceptTerms) {
            Cookies.set("email", email);
            Cookies.set("password", password);
        }

        try {
            const response = await login({ email, password })?.unwrap();

            console.log("response", response);

            if (response?.success) {
                toast.success(response?.message);
                Cookies.set("accessToken", response?.data?.accessToken);
                navigate("/")
                setLoading(false);
            }
        } catch (error: any) {
            toast.error(error?.data?.message);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-screen flex items-center justify-center px-6 bg-gradient-to-br from-black via-[#0A0A0A] to-black">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="" className="w-24 mx-auto" />
                    <h1 className="text-4xl font-serif text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to your account</p>
                </div>

                <div className="bg-[#111111] p-8 rounded-xl border border-[#D4AF37]/20">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    placeholder="••••••••"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37] transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-white">
                            <label className="flex items-center text-gray-400">
                                <input onChange={(e) => setAcceptTerms(e.target.checked)} type="checkbox" className="mr-2 accent-[#D4AF37]" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="text-[#D4AF37] hover:text-[#E4C77D]">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>

                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[#D4AF37] hover:text-[#E4C77D] font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
