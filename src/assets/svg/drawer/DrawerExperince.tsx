/* eslint-disable max-len */
import React from 'react';

interface IProps {
  color: string;
}

const DrawerExperince = ({ color }: IProps) => {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.8641 6.7001C15.8641 8.1001 14.6641 9.3001 13.2641 9.3001C11.8641 9.3001 10.6641 8.1001 10.6641 6.7001C10.6641 5.3001 11.8641 4.1001 13.2641 4.1001C14.6641 4.1001 15.8641 5.3001 15.8641 6.7001Z"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M15.4625 20.2C15.4625 21.5 14.4625 22.5 13.1625 22.5H11.3625C10.0625 22.5 9.0625 21.5 9.0625 20.2V13.3C9.0625 12 10.0625 11 11.3625 11H13.1625C14.4625 11 15.4625 12 15.4625 13.3V20.2V20.2Z"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M20.5625 7.40015C21.8625 7.10015 22.8625 7.70014 23.1625 9.00014C23.4625 10.3001 22.6625 11.5001 21.3625 11.8001L15.5625 13.0001"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M5.96298 18.7C4.66298 19 3.46298 18.2 3.16298 16.9L3.06298 16.7C2.76298 15.4 3.56298 14.2 4.86298 13.9L8.96298 13"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M19.5641 3L19.8641 4H20.8641L20.0641 4.6L20.3641 5.6L19.5641 5L18.6641 5.6L19.0641 4.6L18.1641 4H19.2641L19.5641 3Z"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path d="M16.3633 10.5L16.8633 10.9" stroke={color} strokeMiterlimit="10" />
      <path d="M17.6641 9.30005L17.8641 10" stroke={color} strokeMiterlimit="10" />
      <path d="M19.2641 9L19.1641 9.7" stroke={color} strokeMiterlimit="10" />
      <path d="M20.9629 9.5L20.4629 10.1" stroke={color} strokeMiterlimit="10" />
    </svg>
  );
};

export default DrawerExperince;
