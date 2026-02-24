"use client";

import React from "react";
import Image from "next/image";
import ConvertIcon from "@/icons/convert";
import SendMoneyIcon from "@/icons/send-money";
import ReceiveMoneyIcon from "@/icons/receive-money";
import DashboardIcon from "@/icons/dashboard";
import WalletsIcon from "@/icons/wallets";
import WithdrawIcon from "@/icons/withdraw";
import CardsIcon from "@/icons/cards";
import InvoicesIcon from "@/icons/invoices";
import AnalyticsIcon from "@/icons/analytics";
import SettingsIcon from "@/icons/settings";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  { icon: DashboardIcon, label: "Dashboard", active: true },
  { icon: WalletsIcon, label: "Wallets" },
  { icon: ConvertIcon, label: "Convert" },
  { icon: SendMoneyIcon, label: "Send Money" },
  { icon: ReceiveMoneyIcon, label: "Receive Money" },
  { icon: WithdrawIcon, label: "Withdraw" },
];

const businessMenuItems = [
  { icon: CardsIcon, label: "Cards" },
  { icon: InvoicesIcon, label: "Invoices" },
];

const supportMenuItems = [
  { icon: AnalyticsIcon, label: "Analytics" },
  { icon: SettingsIcon, label: "Settings" },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [selected, setSelected] = React.useState("Dashboard");

  const renderIcon = (item: (typeof menuItems)[0], isSelected: boolean) => {
    const IconComponent = item.icon as React.ComponentType<{
      className?: string;
    }>;
    return (
      <IconComponent
        className={`w-5 h-5 shrink-0 ${
          isSelected ? "brightness-0 invert" : ""
        }`}
      />
    );
  };

  const renderMenuSection = (
    items: typeof menuItems,
    title: string,
    abbr: string,
  ) => (
    <div>
      <p
        className={`text-xs font-bold text-gray-500 ${
          sidebarOpen ? "px-8" : "px-4 text-center"
        } mb-3 mt-6 uppercase tracking-widest`}
      >
        {sidebarOpen ? title : abbr}
      </p>
      <div className="flex flex-col gap-1">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(item.label)}
            title={item.label}
            className={`w-full flex items-center ${
              sidebarOpen ? "gap-3 px-8" : "gap-0 px-4 justify-center"
            } py-3 my-1 rounded-lg transition-all text-[16px] font-medium ${
              selected === item.label
                ? "bg-[#1a7cff] text-white shadow"
                : "text-[#3d4a5c] hover:bg-[#e0eaff]"
            }`}
          >
            {renderIcon(item, selected === item.label)}
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-[#eaf4ff] border-r border-[#E1E7EF] transition-all duration-300 flex flex-col overflow-hidden min-h-screen fixed left-0 top-0 bottom-0 lg:relative`}
    >
      <div className="h-21.5 flex flex-col justify-center">
        <div className="flex justify-end pt-6 px-4">
          <button
            className="text-gray-400 hover:text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Image
              src="/icons/sidebar.svg"
              alt="Toggle Sidebar"
              width={24}
              height={24}
            />
          </button>
        </div>
        <div className="relative flex items-center justify-center p-6 pt-0 pb-1 mb-2">
          <div className="flex items-center justify-center w-full">
            {sidebarOpen ? (
              <Image
                src="/logo.png"
                alt="AlocerPay Logo"
                width={148}
                height={34}
              />
            ) : (
              <p className="text-[#1a7cff] font-bold text-lg">A</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-0 flex flex-col gap-0">
        <div className="mt-4 border-t border-[#E1E7EF] mx-4" />
        {renderMenuSection(menuItems, "MONEY TOOLS", "MT")}

        <div className="my-4 border-t border-[#E1E7EF] mx-4" />
        {renderMenuSection(businessMenuItems, "BUSINESS", "B")}

        <div className="my-4 border-t border-[#E1E7EF] mx-4" />
        {renderMenuSection(supportMenuItems, "SUPPORT", "S")}
      </div>

      <div className="mt-auto px-4 pb-6 flex flex-col gap-4 border-t border-[#E1E7EF] pt-4">
        <button
          title="Logout"
          className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg text-[#e53935] hover:bg-[#ffeaea] transition-all font-semibold"
        >
          <Image
            src="/icons/logout.svg"
            alt="Logout"
            width={20}
            height={20}
            className="shrink-0"
          />
          {sidebarOpen && <span>Logout</span>}
        </button>

        {sidebarOpen && (
          <div className="bg-[#1a7cff] text-white rounded-lg p-4 flex flex-col gap-2 mt-2">
            <div className="flex gap-2 mb-1">
              <Image
                src="/icons/user-tag.svg"
                alt="Help Icon"
                width={20}
                height={20}
                className="shrink-0"
              />
            </div>
            <p className="text-xs font-bold text-[#E6F2FF]">
              Got some questions, inquiries or need help?
            </p>
            <a href="#" className="text-[10px] underline text-white">
              Visit AlocerPay Help Desk Here
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
