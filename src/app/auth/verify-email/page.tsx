"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmail, useResendVerification } from "@/hooks/useAuth";
import Link from "next/link";
import { FiMail, FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: verifyEmail } = useVerifyEmail();
  const { mutateAsync: resendVerification, isPending: isResending } = useResendVerification();

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const hasAttempted = useRef(false);

  const handleVerification = useCallback(
    async (token: string) => {
      setStatus("verifying");
      try {
        await verifyEmail(token);
        setStatus("success");
        setTimeout(() => router.push("/auth/login"), 2000);
      } catch (err: any) {
        setErrorMessage(
          err.response?.data?.detail || "Verification failed. The link may be invalid or expired.",
        );
        setStatus("error");
      }
    },
    [verifyEmail, router],
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
    if (token && !hasAttempted.current) {
      hasAttempted.current = true;
      handleVerification(token);
    }
  }, [searchParams, handleVerification]);

  const handleResend = async () => {
    if (!email) {
      setErrorMessage("Email address is required to resend verification.");
      setStatus("error");
      return;
    }
    setErrorMessage("");
    setStatus("idle");
    try {
      await resendVerification(email);
      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err.response?.data?.detail || "Failed to resend email. Please try again.");
      setStatus("error");
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
              {status === "verifying" ? (
                <FiLoader className="text-6xl text-orange-500 animate-spin" />
              ) : status === "success" ? (
                <FiCheckCircle className="text-6xl text-green-500" />
              ) : status === "error" ? (
                <FiAlertCircle className="text-6xl text-red-400" />
              ) : (
                <div className="text-6xl">✉️</div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              {status === "verifying" ? "Verifying..."
                : status === "success" ? "Email Verified!"
                : status === "error" ? "Verification Failed"
                : "Check Your Email"}
            </h2>

            <p className="text-center text-gray-600 mb-6">
              {status === "verifying" ? "Please wait while we verify your email address."
                : status === "success" ? "Your email has been verified. Redirecting to login..."
                : status === "error" ? "Something went wrong. See below for details."
                : "Click the verification link in your email to continue."}
            </p>

            {status === "success" && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
                <FiCheckCircle className="mt-0.5 flex-shrink-0" size={18} />
                <p className="text-sm">Email verified successfully! Redirecting...</p>
              </div>
            )}

            {status === "error" && errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {(status === "idle" || status === "error") && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Didn&apos;t receive the email?</p>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleResend}
                    disabled={isResending || !email}
                    className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-gray-800">
                ← Back to Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
