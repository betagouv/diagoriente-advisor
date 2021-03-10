import classNames from 'common/utils/classNames';
import moment from 'moment';
import style from './style.module.scss';

interface Props {
  className?: string;
  activities: string[];
  title?: string;
  type?: string;
  date?: string;
  onClick?: () => void;
}
const CardPro = ({ activities, date, className, title, type, onClick }: Props) => {
  const traduireType = (text: string) => {
    let res: string = '';
    switch (text) {
      case 'professional':
        res = 'professionnelle';
        break;
      case 'personal':
        res = 'personnelle';
        break;
      default: {
        res = 'engagement';
      }
    }
    return res;
  };
  return (
    <div onClick={onClick} className={classNames(style.cardContainer, className)}>
      <div className={style.pro}>{type && traduireType(type)}</div>
      <div className={style.title}>{title}</div>
      <div className={style.date}>{moment(date).format('DD/MM/YYYY')}</div>
      <div className={style.activities}>
        {activities.map((activity, i) => (
          // eslint-disable-next-line
          <div key={i} className={style.text}>
            {activity}
          </div>
        ))}
      </div>
    </div>
  );
};
export default CardPro;
