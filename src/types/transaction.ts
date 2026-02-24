import { JSX } from "react";

export interface Transaction {
  name: string;
  time: string;
  amount: string;
  status: "Completed" | "Pending" | "Reversed";
  icon: JSX.Element;
  flag?: string;
  bgColor:string;
  iconColor:string
}