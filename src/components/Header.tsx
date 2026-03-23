"use client";

import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FiMenu, FiLogOut, FiTrash2, FiUser, FiSettings } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { ConfirmationModal } from "@/components/ConfirmationModal";

interface HeaderProps {
  onTrashClick?: () => void;
}

export function Header({ onTrashClick }: HeaderProps) {
  const { user } = useAuthStore();
  const logout = useLogout();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    router.push("/auth/login");
  };

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const getInitials = (fullName?: string) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        isDangerous
      />
      <header className="sticky top-0 z-40 bg-slate-800 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">
              Q
            </div>
            <h1 className="text-xl font-bold">Quill</h1>
          </div>

          <div className="flex items-center gap-4">
            {onTrashClick && (
              <button
                onClick={onTrashClick}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                title="Trash"
              >
                <FiTrash2 size={18} />
                <span>Trash</span>
              </button>
            )}

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors overflow-hidden"
                title="Profile"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {getInitials(user?.full_name)}
                  </span>
                )}
              </button>

              {profileMenuOpen && (
                <div className="hidden md:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 animate-fade-in text-gray-800">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.full_name || "User"}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <FiUser size={16} />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/profile#setting");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-200"
                  >
                    <FiSettings size={16} />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-700 p-4 space-y-2">
            {onTrashClick && (
              <button
                onClick={() => {
                  onTrashClick();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm flex items-center gap-2"
              >
                <FiTrash2 size={16} />
                <span>Trash</span>
              </button>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/profile");
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm flex items-center gap-2"
            >
              <FiUser size={16} />
              <span>View Profile</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/profile#setting");
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm flex items-center gap-2"
            >
              <FiSettings size={16} />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2 text-red-300"
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>
    </>
  );
}
