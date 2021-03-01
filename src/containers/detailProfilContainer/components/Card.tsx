import view from 'assets/svg/View.svg';
import style from './card.module.scss';

interface Props {
  title: string;
  showView?: boolean;
  description: string;
}
const Card = ({ title, description, showView }: Props) => {
  return (
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.text}>{description}</div>
      {!showView && <img src={view} alt="" className={style.viewIcon} />}
    </div>
  );
};

export default Card;
