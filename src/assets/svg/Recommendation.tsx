/* eslint-disable max-len */
import React from 'react';

interface Props {
  color: string;
  width: string;
  height: string;
}

const Recommendation = ({ color, width, height }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 18 16">
      <path
        fill={color}
        d="M9.002.889c-3.405 0-6.228 2.823-6.228 6.227 0 3.404 2.823 6.227 6.228 6.227 3.404 0 6.227-2.823 6.227-6.227A6.219 6.219 0 009.002.889zm2.324 9.548L9.002 9.192l-2.325 1.245.415-2.574-1.827-1.827 2.574-.415 1.163-2.324 1.162 2.324 2.574.415-1.91 1.827.498 2.574zM5.431 13.51L2.941 16l-.167-2.574L.2 13.26l2.491-2.408M12.571 13.51L15.062 16l.166-2.574 2.574-.166-2.408-2.408"
      />
    </svg>
  );
};

export default Recommendation;
