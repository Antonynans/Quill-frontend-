import React from "react";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
};

export default function PlusIcon({ width = 20, height = 20, className = "", color = "currentColor" }: Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10.0003 4.16699V15.8337" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.16699 10H15.8337" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}