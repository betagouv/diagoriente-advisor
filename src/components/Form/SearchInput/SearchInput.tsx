/* eslint-disable max-len */
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import classes from './styles.module.scss';

interface SearchInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onSearch?: () => void;
}

const SearchInput = ({ onSearch, ...rest }: SearchInputProps) => {
  return (
    <div className={classes.container}>
      <input {...rest} className={classes.input} />
      <svg
        cursor="pointer"
        onClick={onSearch}
        width="31"
        height="32"
        viewBox="0 0 31 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 32L1 -4.20262e-07" stroke="#C1C1C5" strokeMiterlimit="10" />
        <path
          d="M20.3 21.6C24.3317 21.6 27.6 18.3317 27.6 14.3C27.6 10.2683 24.3317 7 20.3 7C16.2683 7 13 10.2683 13 14.3C13 18.3317 16.2683 21.6 20.3 21.6Z"
          stroke="#10255E"
          strokeMiterlimit="10"
        />
        <path d="M25.4702 19.47L30.6302 24.63" stroke="#10255E" strokeMiterlimit="10" />
      </svg>
    </div>
  );
};

export default SearchInput;
