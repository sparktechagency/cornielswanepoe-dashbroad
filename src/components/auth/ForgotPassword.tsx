import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui//button"
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useForgetPasswordMutation } from "../../redux/features/auth/authApi";
import { toast } from "sonner";

export default function ForgotPassword() {

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const [forgotPassword] = useForgetPasswordMutation();;


  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await forgotPassword({ email }).unwrap();
      console.log("Password reset response:", response);
      navigate("/otp-verify");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send reset instructions. Please try again.");
    }

  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center px-6 py-12 bg-linear-to-br from-black via-[#0A0A0A] to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="" className="w-24 mx-auto" />
            <h1 className="text-4xl font-serif text-white mb-2">Forgot Password</h1>
            <p className="text-gray-400">Enter your email to receive reset instructions</p>
          </div>
        </div>

        <div className="bg-[#111111] p-8 rounded-xl border border-[#D4AF37]/20">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending Instructions...' : 'Send Reset Link'}
            </Button>

          </form>

          <div className="mt-6 text-center text-white">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>For security purposes, password reset otp  expire after 3 minutes.</p>
        </div>
      </div>
    </div>
  )
}
