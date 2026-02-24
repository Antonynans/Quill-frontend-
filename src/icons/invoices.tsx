import React from "react";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
};

export default function InvoicesIcon({ width = 20, height = 20, className = "", color = "currentColor" }: Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12.5007 1.66699H5.00065C4.55862 1.66699 4.1347 1.84259 3.82214 2.15515C3.50958 2.46771 3.33398 2.89163 3.33398 3.33366V16.667C3.33398 17.109 3.50958 17.5329 3.82214 17.8455C4.1347 18.1581 4.55862 18.3337 5.00065 18.3337H15.0007C15.4427 18.3337 15.8666 18.1581 16.1792 17.8455C16.4917 17.5329 16.6673 17.109 16.6673 16.667V5.83366L12.5007 1.66699Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.666 1.66699V5.00033C11.666 5.44235 11.8416 5.86628 12.1542 6.17884C12.4667 6.4914 12.8907 6.66699 13.3327 6.66699H16.666" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.33268 7.5H6.66602" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.3327 10.833H6.66602" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.3327 14.167H6.66602" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}