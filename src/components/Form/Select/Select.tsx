import React, { useRef, useState } from 'react';
import classesNames from 'common/utils/classNames';
import ArrowSelect from 'assets/svg/arrowSelect.svg';
import useOnclickOutside from 'common/hooks/useOnclickOutside';
import classes from './select.module.scss';

interface IProps {
  options: { value: string; label: string }[];
  isOpen?: boolean;
  onClickSelect?: () => void;
  label: string;
  value: string;
  withBorder?: boolean;
  onClickItem: (e: string) => void;
  classes?: {
    container?: string;
    label?: string;
    options?: string;
    option?: string;
  };
}

const Select = ({ options, value, withBorder, isOpen, onClickSelect, onClickItem, label, classes: c }: IProps) => {
  const [open, setOpen] = useState(isOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onOpen = () => {
    setOpen(!open);
  };

  const onSelectItem = (ev: React.MouseEvent<any>, option: string) => {
    ev.preventDefault();
    onClickItem(option);
  };

  useOnclickOutside(wrapperRef, () => {
    setOpen(false);
  });

  const classesProp = c || {};

  return (
    <div
      ref={wrapperRef}
      className={classesNames(classes.container_select, withBorder && classes.selectBorder, classesProp.container)}
      onClick={onClickSelect || onOpen}
    >
      <span className={classesNames(classes.label_select, classesProp.label)}>
        {options.find((o) => o.value === value)?.label || label}
      </span>
      <img src={ArrowSelect} width={15} height={8} alt="arrow" className={classes.arrowSelect} />
      {(isOpen === undefined ? open : isOpen) && (
        <div className={classesNames(classes.container_options, classesProp.options)}>
          {options.map((option) => (
            <div
              key={option.value}
              className={classesNames(classes.item_option, classesProp.option)}
              onClick={(ev) => onSelectItem(ev, option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
