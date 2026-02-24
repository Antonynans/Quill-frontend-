import React from "react";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
};

export default function ArrowUpIcon({ width = 20, height = 20, className = "", color = "currentColor" }: Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5.83398 5.83398H14.1673V14.1673" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.83398 14.1673L14.1673 5.83398" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}