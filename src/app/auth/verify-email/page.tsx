"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { FiMail, FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmailToken, resendVerification, isLoading } = useAuthStore();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = useCallback(
    async (token: string) => {
      setError("");
      setSuccess("");

      try {
        await verifyEmailToken(token);
        setSuccess("Email verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Verification failed. The link may be invalid or expired.",
        );
        setIsVerifying(false);
      }
    },
    [verifyEmailToken, router],
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (token && !isVerifying) {
      setIsVerifying(true);
      handleVerification(token);
    }
  }, [searchParams, handleVerification, isVerifying]);

  const handleResend = async () => {
    if (!email) {
      setError("Email address is required to resend verification.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await resendVerification(email);
      setSuccess("Verification email sent! Check your inbox.");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to resend email. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiMail className="text-3xl text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verify Email</h1>
            <p className="text-orange-100">Confirm your email address</p>
          </div>

          <div className="px-6 py-8">
            <div className="mb-6 flex justify-center">
              {isVerifying ? (
                <FiLoader className="text-6xl text-orange-500 animate-spin" />
              ) : (
                <div className="text-6xl">✉️</div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              Email Verification
            </h2>

            {isVerifying ? (
              <p className="text-center text-gray-600 mb-6">
                Verifying your email address...
              </p>
            ) : (
              <p className="text-center text-gray-600 mb-6">
                Click the verification link in your email to continue.
              </p>
            )}

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

            {!isVerifying && !success && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Didn&apos;t receive the email?
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleResend}
                    disabled={isLoading || !email}
                    className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Resend Verification Email"}
                  </button>
                  <div className="text-sm text-gray-500">
                    Or enter your email to resend:
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/auth/signup"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Back to Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
