"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ActionButtons from "../components/ActionButtons";
import TransactionsSection from "../components/TransactionSection";
import WalletSection from "@/components/WalletSection";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="Joy Keleb" userImage="/user.png" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 lg:p-16 lg:py-8 space-y-8 mx-auto">
            <WalletSection />

            <ActionButtons />

            <TransactionsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
