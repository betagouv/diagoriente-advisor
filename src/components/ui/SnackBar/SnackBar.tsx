import { SnackbarVariant } from 'common/contexts/SnackbarContext';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';
import classNames from 'utils/classNames';

import error from 'assets/svg/error.svg';
import info from 'assets/svg/info.svg';
import warning from 'assets/svg/warning.svg';
import success from 'assets/svg/success.svg';

import style from './styles.module.scss';

const icons = {
  error,
  info,
  warning,
  success,
};

interface SnackBarProps {
  open: boolean;
  onClose: () => void;
  variant: SnackbarVariant;
  message?: string;
}

const SnackBar = ({ open, onClose, message, variant: variantProps }: SnackBarProps) => {
  const variant = useRef(variantProps);

  if (open) {
    variant.current = variantProps;
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (open) {
        onClose();
      }
    }, 5000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [open]);

  return createPortal(
    <Transition mountOnEnter unmountOnExit timeout={250} in={open}>
      {(state) => (
        <div className={classNames(style.snackbar, style[variant.current], state === 'entered' && style.snackbarOpen)}>
          <img className={style.icon} src={icons[variant.current]} alt="" />
          {message}
        </div>
      )}
    </Transition>,
    document.getElementById('root') as HTMLDivElement,
  );
};

export default SnackBar;
