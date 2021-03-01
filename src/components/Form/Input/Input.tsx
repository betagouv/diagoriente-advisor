import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import classNames from 'utils/classNames';
import style from './style.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<any>) => void;
  placeholder?: string;
  containerClassName?: string;
  required?: boolean;
  type?: string;
}
const Input = ({ label, containerClassName, required, ...rest }: Props) => {
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
      <div className={style.wrapperInput}>
        <input {...rest} required={required} className={style.input} />
      </div>
    </div>
  );
};
export default Input;
