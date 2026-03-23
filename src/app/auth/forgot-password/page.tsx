"use client";

import { useState } from "react";
import { useForgotPassword } from "@/hooks/useAuth";
import Link from "next/link";
import { FiMail, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess("If that email exists, a password reset link has been sent.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="bg-orange-600 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiMail className="text-3xl text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
            <p className="text-orange-100">Reset your password</p>
          </div>

          <div className="px-6 py-8">
            <div className="mb-6 flex justify-center">
              <div className="text-6xl">🔐</div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Reset Password</h2>
            <p className="text-center text-gray-600 mb-6">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
                <FiCheckCircle className="mt-0.5 flex-shrink-0" size={18} />
                <p className="text-sm">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-800">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
