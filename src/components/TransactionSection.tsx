"use client";

import TransactionCard from "./TransactionCard";
import { transactions } from "./TransactionData";

const TransactionsSection = ({}) => {
  return (
    <div className="space-y-4 border border-[#E1E7EF] rounded-xl p-6 flex flex-col gap-2.5">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-lg font-medium text-[#1A1F23]">
          Recent Transactions
        </h2>
        <a
          href="#"
          className="text-[#007BFF] font-semibold text-sm hover:text-[#0056cc] transition-colors"
        >
          View All
        </a>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction, idx) => (
          <TransactionCard key={idx} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionsSection;
