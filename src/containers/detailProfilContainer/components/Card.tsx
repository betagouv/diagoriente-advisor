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
        placement="top"
        overlay={description}
        overlayInnerStyle={{
          backgroundColor: '#10255e',
          borderRadius: '10px',
          color: '#ffffff',
          fontSize: '12px',
          padding: '10',
          cursor: 'pointer',
        }}
        arrowContent={<div className="rc-tooltip-arrow-inner" />}
      >
        <div className={style.text}>{description}</div>
      </Tooltip>
      {showView && <img src={view} alt="" className={style.viewIcon} />}
    </div>
  );
};

export default Card;
