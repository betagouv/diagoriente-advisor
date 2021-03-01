/* eslint-disable max-len */
import React from 'react';

interface IProps {
  color: string;
}

const DrawerProfil = ({ color }: IProps) => {
  return (
    <svg width="33" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.58984 19.78V16.93C6.58984 14.59 8.48984 12.7 10.8198 12.7C13.1598 12.7 15.0498 14.6 15.0498 16.93V19.78"
        stroke={color}
      />
      <path
        d="M10.82 20.64C16.2434 20.64 20.64 16.2434 20.64 10.82C20.64 5.39656 16.2434 1 10.82 1C5.39656 1 1 5.39656 1 10.82C1 16.2434 5.39656 20.64 10.82 20.64Z"
        stroke={color}
      />
      <path
        d="M10.8201 11.01C12.1732 11.01 13.2701 9.91308 13.2701 8.55999C13.2701 7.20689 12.1732 6.10999 10.8201 6.10999C9.46702 6.10999 8.37012 7.20689 8.37012 8.55999C8.37012 9.91308 9.46702 11.01 10.8201 11.01Z"
        stroke={color}
      />
    </svg>
  );
};

export default DrawerProfil;
