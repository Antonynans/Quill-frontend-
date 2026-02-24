"use client";

import Image from "next/image";

interface HeaderProps {
  userName: string;
  userImage: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userImage }) => {
  return (
    <div className="h-21.5 bg-white border-b border-[#E1E7EF] flex items-center justify-between px-16 shrink-0 shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] ml-0 lg:ml-0">
      <div />

      <div className="flex items-center gap-6">
        <button className="relative  transition-colors">
          <Image
            src="/icons/bell.svg"
            alt="Notifications"
            width={24}
            height={24}
          />
        </button>

        <div className="flex items-center gap-3 pl-6">
          <Image
            src={userImage}
            alt="user"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-medium text-xs text-[#344256]">{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
