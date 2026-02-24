"use client";

import { Transaction } from "@/types/transaction";
import Image from "next/image";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-[#65758B]";
      case "Pending":
        return "text-[#DAB440]";
      case "Reversed":
        return "text-[#DC2626]";
      default:
        return "text-[#65758B]";
    }
  };

  const getAmountColor = (amount: string) => {
    return amount.startsWith("+") ? "text-[#21C45D]" : "text-[#1A1F23]";
  };

  if (!transaction) return null;

  return (
    <div className=" p-4 flex items-center justify-between ">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl`}
            style={{
              backgroundColor: transaction.bgColor,
              color: transaction.iconColor,
            }}
          >
            {transaction.icon}
          </div>
          {transaction.flag && (
            <Image
              src={transaction.flag}
              alt="flag"
              width={16}
              height={12}
              className="absolute bottom-0 right-0"
            />
          )}
        </div>

        <div className="flex flex-col">
          <p className="font-medium text-[#1A1F23]">{transaction.name}</p>
          <p className="text-sm text-[#65758B]">{transaction.time}</p>
        </div>
      </div>

      <div className="text-right flex flex-col items-end gap-1">
        <p className={`font-semibold ${getAmountColor(transaction.amount)}`}>
          {transaction.amount}
        </p>
        <p className={`text-xs ${getStatusColor(transaction.status)} `}>
          {transaction.status}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
