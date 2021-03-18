import React from 'react';

interface IProps {
  color: string;
}

const DrawerAcitivite = ({ color }: IProps) => {
  return (
    <div>
      <svg width="33" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          // eslint-disable-next-line max-len
          d="M3.75 19.33C2.23 19.33 1 20.56 1 22.08V16.57V3.75C1 2.23 2.23 1 3.75 1H16.71C18.23 1 19.46 2.23 19.46 3.75V16.58C19.46 18.1 18.23 19.33 16.71 19.33H3.75Z"
          stroke={color}
          strokeMiterlimit="10"
        />
        <path
          d="M19.46 16.58V22.09C19.46 23.61 18.23 24.84 16.71 24.84H3.75C2.23 24.84 1 23.61 1 22.09"
          stroke={color}
          strokeMiterlimit="10"
        />
        <path d="M1 22.09H19.46" stroke={color} strokeMiterlimit="10" />
      </svg>
    </div>
  );
};

export default DrawerAcitivite;
