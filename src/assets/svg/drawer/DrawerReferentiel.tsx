import React from 'react';

interface IProps {
  color: string;
}

const DrawerReferentiel = ({ color }: IProps) => {
  return (
    <svg width="33" height="26" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 5.58667V14.8667L9 19.4533L17 14.8667V5.58667L9 1L1 5.58667Z" stroke={color} strokeMiterlimit="10" />
      <path d="M1 5.58667L17 14.8667" stroke={color} strokeMiterlimit="10" />
      <path d="M1 14.8667L17 5.58667" stroke={color} strokeMiterlimit="10" />
      <path d="M9 1V19.4533" stroke={color} strokeMiterlimit="10" />
    </svg>
  );
};
export default DrawerReferentiel;
