import ArrowUpIcon from "@/icons/arrorw-up";
import ArrowDownIcon from "@/icons/arrow-down";
import ConvertIcon from "@/icons/convert";
import { Transaction } from "@/types/transaction";

export const transactions: Transaction[] = [
  {
    name: "John Smith",
    time: "Today, 2:30 PM",
    amount: "+$250.00",
    status: "Completed",
    icon: <ArrowDownIcon />,
    flag: "/icons/usd-flag.svg",
    bgColor: "#00C7B31A",
    iconColor: "#00C7B3",
  },
  {
    name: "Sarah Johnson",
    time: "Today, 1:15 AM",
    amount: "-$180.00",
    status: "Pending",
    icon: <ConvertIcon />,
    bgColor: "#E5F2FF",
    iconColor: "#007BFF",
  },
  {
    name: "Tech Corp Ltd",
    time: "Yesterday, 4:45 PM",
    amount: "+€500.00",
    status: "Completed",
    icon: <ArrowUpIcon />,
    flag: "/icons/ngn-flag.svg",
    bgColor: "#EF44441A",
    iconColor: "#EF4444",
  },
  {
    name: "Monthly Subscription",
    time: "Dec 28, 9:00 AM",
    amount: "-£75.50",
    status: "Reversed",
    icon: <ArrowDownIcon />,
    flag: "/icons/ngn-flag.svg",
    bgColor: "#00C7B31A",
    iconColor: "#00C7B3",
  },
];
