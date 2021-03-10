import React from 'react';
import classNames from 'utils/classNames';
import style from './style.module.scss';

interface Props {
  label: string;
  containerStyle?: string;
  className?: string;
  outlined?: boolean;
  disable?: boolean;
  onClick?: () => void;
  logo?: string;
  type?: 'button' | 'submit' | 'reset';
}
const Button = ({ label, containerStyle, className, outlined, disable, onClick, logo, type }: Props) => {
  return (
    <div className={classNames(containerStyle, style.buttonContainer)}>
      <button
        type={type || 'submit'}
        className={classNames(className, containerStyle, !outlined ? style.filledButton : style.outlinedButton)}
        onClick={onClick}
        disabled={disable}
      >
        {logo && <img src={logo} alt=" " height={26} className={style.logo} />}

        {label}
      </button>
    </div>
  );
};
export default Button;
