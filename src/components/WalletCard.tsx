"use client";

import { Wallet } from "@/types/wallet";
import { useState } from "react";
import Image from "next/image";
import { FiCheck } from "react-icons/fi";
import KycBadge from "@/icons/kyc-badge";
import VerifiedIcon from "@/icons/Verified";

interface WalletCardProps {
  wallet: Wallet;
  showAllBalances: boolean;
  onToggle: () => void;
  isIndividuallyHidden: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  showAllBalances,
  onToggle,
  isIndividuallyHidden,
}) => {
  const [copied, setCopied] = useState(false);

  const isBalanceVisible = showAllBalances
    ? !isIndividuallyHidden
    : isIndividuallyHidden;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DEE0E4] p-4 hover:shadow-lg transition-all min-w-70 flex flex-col h-full">
      <div className="flex items-center justify-end">
        <div
          className="inline-flex items-center gap-1 text-[10px] font-medium p-1 rounded-md"
          style={{ backgroundColor: wallet.bgColor, color: wallet.textColor }}
        >
          {wallet.icon === "verified" ? (
            <VerifiedIcon className="w-3.5 h-3.5" />
          ) : (
            <KycBadge className="w-3.5 h-3.5" />
          )}
          <span>{wallet.kyc}</span>
        </div>
      </div>

      {/* Currency & Flag */}
      <div className="mt-2 flex flex-col justify-between h-full">
        <div className="flex items-center gap-3">
          <Image
            src={wallet.flag}
            alt={`${wallet.currency} flag`}
            width={28}
            height={20}
          />
          <p className="text-sm text-[#65758B] ">{wallet.currency}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold ">
            {isBalanceVisible ? wallet.balance : wallet.maskedBalance}
          </p>
          <button
            onClick={onToggle}
            className=" transition-colors shrink-0 cursor-pointer"
            title="Toggle balance visibility"
          >
            {isBalanceVisible ? (
              <Image
                src="/icons/eye.svg"
                alt="Eye Open"
                width={20}
                height={20}
              />
            ) : (
              <Image
                src="/icons/eye-off.svg"
                alt="Eye Closed"
                width={20}
                height={20}
              />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 w-fit bg-[#F4F4F4] border-[#E1E7EF]">
          <p className="text-sm text-[#8B96A1]">{wallet.account}</p>
          <button
            onClick={handleCopy}
            className={`transition-colors shrink-0 cursor-pointer ${
              copied
                ? "text-[#21c45d]"
                : "text-[#007BFF] hover:text-[#007BFF]30%"
            }`}
            title="Copy account number"
          >
            {copied ? (
              <FiCheck size={12} />
            ) : (
              <Image src="/icons/copy.svg" width={16} height={16} alt="Copy" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
