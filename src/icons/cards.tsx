import React from "react";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
};

export default function CardsIcon({ width = 20, height = 20, className = "", color = "currentColor" }: Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16.666 4.16699H3.33268C2.41221 4.16699 1.66602 4.91318 1.66602 5.83366V14.167C1.66602 15.0875 2.41221 15.8337 3.33268 15.8337H16.666C17.5865 15.8337 18.3327 15.0875 18.3327 14.167V5.83366C18.3327 4.91318 17.5865 4.16699 16.666 4.16699Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.66602 8.33301H18.3327" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}