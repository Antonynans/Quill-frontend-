"use client";

import ConvertIcon from "@/icons/convert";
import InvoicesIcon from "@/icons/invoices";
import PlusIcon from "@/icons/plus";
import SendMoneyIcon from "@/icons/send-money";

const ActionButtons = () => {
  const actions = [
    { icon: PlusIcon, label: "Add Money" },
    { icon: ConvertIcon, label: "Convert" },
    { icon: SendMoneyIcon, label: "Send" },
    { icon: InvoicesIcon, label: "Create Invoice" },
  ];

  return (
    <div className="border border-[#E1E7EF] rounded-md py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
      {actions.map((action, idx) => (
        <button
          key={idx}
          className="border-2 border-[#007BFF] text-[#007BFF] rounded-xl py-4 px-6 font-semibold transition-all flex flex-col items-center gap-2"
        >
          <action.icon className="w-5 h-5 text-[#007BFF]" />
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
    </div>
  );
};

export default ActionButtons;