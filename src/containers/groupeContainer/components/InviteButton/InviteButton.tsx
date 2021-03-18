import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

import ActionButton from '../ActionButton/ActionButton';

import style from './styles.module.scss';

const InviteButton = (
  props: Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'children' | 'className'>,
) => (
  <ActionButton {...props} className={style.invite}>
    inviter
  </ActionButton>
);

export default InviteButton;
