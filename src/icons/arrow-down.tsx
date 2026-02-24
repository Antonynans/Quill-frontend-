import React from "react";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
};

export default function ArrowUpIcon({
  width = 20,
  height = 20,
  className = "",
  color = "currentColor",
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.1654 5.83301L5.83203 14.1663"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1654 14.1663H5.83203V5.83301"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
