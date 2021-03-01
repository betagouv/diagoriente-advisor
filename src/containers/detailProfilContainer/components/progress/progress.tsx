import classNames from 'utils/classNames';
import style from './progress.module.scss';

interface Props {
  frontWidth: string;
  color?: string;
}
const progress1 = ({ frontWidth, color }: Props) => {
  return (
    <div className={style.container}>
      <div className={style.progressBack}>
        <div className={classNames(style.progressFront, color)} style={{ width: frontWidth }}>
          {' '}
        </div>
      </div>
    </div>
  );
};

export default progress1;
