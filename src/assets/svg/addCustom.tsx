import React from 'react';

interface IProps {
  width: string;
  height: string;
  color: string;
  strokeWidth?: string;
}

const plus = ({ width, height, color, strokeWidth }: IProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.203125 9.75L19.295 9.75" stroke={color} strokeWidth={strokeWidth} />
      <path d="M9.75 0.204102V19.296" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
};

export default plus;
