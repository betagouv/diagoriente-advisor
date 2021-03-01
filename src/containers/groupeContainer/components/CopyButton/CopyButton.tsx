import useSnackBar from 'common/hooks/useSnackBar';
import copyText from 'common/utils/copyText';
import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

import ActionButton from '../ActionButton/ActionButton';

import style from './styles.module.scss';

interface CopyButtonProps
  extends Omit<
    DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    'children' | 'className' | 'onClick'
  > {
  code: string;
}

const CopyButton = ({ code, ...props }: CopyButtonProps) => {
  const { open } = useSnackBar();
  return (
    <ActionButton
      {...props}
      onClick={() => {
        copyText(code);
        open('copié!');
      }}
      className={style.copy}
    >
      copier le code
    </ActionButton>
  );
};

export default CopyButton;
