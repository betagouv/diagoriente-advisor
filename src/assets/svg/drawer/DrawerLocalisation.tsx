import React from 'react';

interface IProps {
  color: string;
}

const DrawerLogo = ({ color }: IProps) => {
  return (
    <div>
      <svg width="33" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          // eslint-disable-next-line max-len
          d="M14.5075 3.3175C11.4175 0.2275 6.4075 0.2275 3.3175 3.3175C0.2275 6.4075 0.2275 11.4175 3.3175 14.5075L8.9075 20.0975L14.5075 14.4975C17.5975 11.4075 17.5975 6.4075 14.5075 3.3175ZM8.9175 11.2775C7.4975 11.2775 6.3475 10.1275 6.3475 8.7075C6.3475 7.2875 7.4975 6.1375 8.9175 6.1375C10.3375 6.1375 11.4875 7.2875 11.4875 8.7075C11.4875 10.1275 10.3375 11.2775 8.9175 11.2775Z"
          stroke={color}
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
};

export default DrawerLogo;
