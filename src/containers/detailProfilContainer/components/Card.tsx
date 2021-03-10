import view from 'assets/svg/View.svg';
import Tooltip from 'rc-tooltip';
import style from './card.module.scss';
import 'rc-tooltip/assets/bootstrap_white.css';

interface Props {
  title: string;
  showView?: boolean;
  description: string;
}
const Card = ({ title, description, showView }: Props) => {
  return (
    <div className={style.container}>
      <div className={style.title}>{title}</div>

      <Tooltip
        overlayClassName={style.tooltip}
        placement="bottom"
        overlay={description}
        arrowContent={<div className="rc-tooltip-arrow-inner" />}
      >
        <div className={style.text}>
          {/* {description.split(' ').slice(0, 10).join(' ')}
          {description.length > 10 && <span>...</span>} */}
          {description}
        </div>
      </Tooltip>
      {showView && <img src={view} alt="" className={style.viewIcon} />}
    </div>
  );
};

export default Card;
