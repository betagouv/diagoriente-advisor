import React, { ChangeEvent, forwardRef, Ref } from 'react';
import classNames from 'utils/classNames';
import style from './style.module.scss';

interface Props {
  containerClassName?: string;
  text?: string;
  checked?: boolean;
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
const Checkbox = forwardRef(
  ({ containerClassName, text, checked, name, onChange }: Props, ref: Ref<HTMLInputElement>) => {
    return (
      /* eslint-disable-next-line */
      <label className={classNames(containerClassName, style.checkboxContainer)}>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} ref={ref} />
        <span className={checked ? style.checked : style.unchecked} />
        {text && <span className={style.label}>{text}</span>}
      </label>
    );
  },
);
export default Checkbox;
