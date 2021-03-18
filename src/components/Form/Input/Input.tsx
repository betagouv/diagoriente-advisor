import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import classNames from 'utils/classNames';
import passwordEye from 'assets/svg/passIcon.svg';
import style from './style.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  value?: string;
  showPassword?: () => void;
  onChange?: (e: ChangeEvent<any>) => void;
  placeholder?: string;
  containerClassName?: string;
  war?: string;
  required?: boolean;
  type?: string;
}
const Input = ({ label, containerClassName, war, required, showPassword, ...rest }: Props) => {
  return (
    <div className={classNames(containerClassName, style.inputContainer)}>
      {label && (
        <div className={style.labelContainer}>
          <div className={style.label}>
            {label}
            {required && <span>*</span>}
          </div>
        </div>
      )}
      <div className={classNames(style.wrapperInput)}>
        <input {...rest} required={required} className={classNames(style.input, war)} />
        {showPassword ? (
          <img src={passwordEye} alt="view" onClick={showPassword} className={style.showPasswordImage} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
export default Input;
