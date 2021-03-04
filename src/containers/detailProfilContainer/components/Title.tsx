import Tooltip from 'rc-tooltip';
import style from './title.module.scss';
import 'rc-tooltip/assets/bootstrap_white.css';

interface Props {
  title: string;
  date: string;
}
const Title = ({ title, date }: Props) => {
  return (
    <div className={style.container}>
      <Tooltip
        overlayClassName={style.tooltip}
        placement="bottom"
        overlay={title}
        arrowContent={<div className="rc-tooltip-arrow-inner" />}
      >
        <div className={style.title}>{title}</div>
      </Tooltip>
      <div className={style.text}>{date}</div>
    </div>
  );
};

export default Title;
