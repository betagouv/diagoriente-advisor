/* eslint-disable max-len */
import React from 'react';

interface IProps {
  color: string;
}

const DrawerGroupes = ({ color }: IProps) => {
  return (
    <svg width="33" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.8799 14.67V11.82C11.8799 9.48003 13.7799 7.59003 16.1099 7.59003C18.4499 7.59003 20.3399 9.49003 20.3399 11.82V14.67"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M1 14.67V11.82C1 9.48003 2.9 7.59003 5.23 7.59003C7.57 7.59003 9.46 9.49003 9.46 11.82V14.67"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M15.5398 5.9C16.8929 5.9 17.9898 4.8031 17.9898 3.45C17.9898 2.0969 16.8929 1 15.5398 1C14.1867 1 13.0898 2.0969 13.0898 3.45C13.0898 4.8031 14.1867 5.9 15.5398 5.9Z"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M5.65996 5.9C7.01306 5.9 8.10996 4.8031 8.10996 3.45C8.10996 2.0969 7.01306 1 5.65996 1C4.30686 1 3.20996 2.0969 3.20996 3.45C3.20996 4.8031 4.30686 5.9 5.65996 5.9Z"
        stroke={color}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export default DrawerGroupes;
