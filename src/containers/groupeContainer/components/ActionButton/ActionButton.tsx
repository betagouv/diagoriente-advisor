import classNames from 'common/utils/classNames';
import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import style from './styles.module.scss';

const ActionButton = ({
  children,
  className,
  ...rest
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
  <button {...rest} className={classNames(style.button, className)}>
    {children}
  </button>
);

export default ActionButton;
