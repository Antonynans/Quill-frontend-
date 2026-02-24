"use client";

import { useState } from "react";
import WalletCard from "./WalletCard";
import { walletsData } from "./WalletData";
import PlusIcon from "@/icons/plus";
import Image from "next/image";

const WalletSection: React.FC = () => {
  const [showAllBalances, setShowAllBalances] = useState(false);

  const [hiddenWallets, setHiddenWallets] = useState<boolean[]>(
    walletsData.map(() => false),
  );

  const toggleWalletVisibility = (index: number) => {
    setHiddenWallets((prev) => {
      const newHidden = [...prev];
      newHidden[index] = !newHidden[index];
      return newHidden;
    });
  };

  const handleShowAllToggle = () => {
    if (showAllBalances) {
      setHiddenWallets(walletsData.map(() => false));
    }

    setShowAllBalances(!showAllBalances);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#1A1F23] mb-2">
          Welcome back, Joy!
        </h1>
        <p className="text-[#65758B]">Here&apos;s your financial overview</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1A1F23]">Your Wallets</h2>
          <button
            onClick={handleShowAllToggle}
            className="flex items-center gap-2 font-semibold text-sm transition-colors"
          >
            {showAllBalances ? (
              <>
                <Image
                  src="/icons/eye.svg"
                  alt="Eye Open"
                  width={20}
                  height={20}
                />
                <span className="text-gray-600">Hide</span>
              </>
            ) : (
              <>
                <Image
                  src="/icons/eye-off.svg"
                  alt="Eye Closed"
                  width={20}
                  height={20}
                />
                <span className="text-[#1A1F23]">Show</span>
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {walletsData.map((wallet, idx) => (
            <div key={idx} className="shrink-0">
              <WalletCard
                wallet={wallet}
                showAllBalances={showAllBalances}
                isIndividuallyHidden={hiddenWallets[idx]}
                onToggle={() => toggleWalletVisibility(idx)}
              />
            </div>
          ))}

          <div className="shrink-0 w-64.5 h-48.5">
            <div className="bg-[#EAF4FF] h-full rounded-2xl border-2 border-dashed border-[#007BFF] p-4 flex items-center justify-center transition-all cursor-pointer hover:border-[#0056cc] hover:bg-[#E6F0FF]">
              <div className="text-center text-[#007BFF] flex flex-col items-center">
                <PlusIcon />
                <p className=" font-semibold text-sm">Add Wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
