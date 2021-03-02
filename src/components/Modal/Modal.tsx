import React from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from 'assets/svg/close icon.svg';
import classNames from 'common/utils/classNames';
import { Transition } from 'react-transition-group';
import style from './style.module.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactElement;
  className?: string;
  widthSize?: string;
  heightSize?: string;
  bkground?: string;
  wrapper?: string;
  body?: string;
  close?: string;
  backdropClassName?: string;
}

const ModalContainer = ({
  onClose,
  isOpen,
  children,
  className,
  widthSize,
  heightSize,
  bkground,
  wrapper,
  body,
  backdropClassName,
  close,
}: IProps) => {
  return createPortal(
    <>
      <Transition in={isOpen} mountOnEnter unmountOnExit timeout={300}>
        {(state) => (
          <div
            className={classNames(
              style.backdrop,
              state === 'entered' ? style['backdrop-active'] : style['backdrop-exit'],
              backdropClassName,
            )}
          />
        )}
      </Transition>
      <Transition in={isOpen} timeout={300} mountOnEnter unmountOnExit>
        {(state) => (
          <div
            className={classNames(
              style.modalContainer,
              wrapper,
              state === 'entered' ? style['alert-active'] : style['alert-exit'],
            )}
          >
            <div
              className={classNames(style.modalWrapper, className)}
              style={{ width: widthSize, height: heightSize, backgroundColor: bkground }}
            >
              <div className={style.headerModal}>
                <img
                  src={CloseIcon}
                  onClick={onClose}
                  alt=" "
                  height={24}
                  width={26}
                  className={classNames(style.closeButton, close)}
                />
              </div>
              <div className={classNames(style.modalBody, body)}>{children}</div>
            </div>
          </div>
        )}
      </Transition>
    </>,
    document.getElementById('root') as HTMLDivElement,
  );
};

export default ModalContainer;
