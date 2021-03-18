import style from './title.module.scss';

interface Props {
  title: string;
  date: string;
}
const Title = ({ title, date }: Props) => {
  return (
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.text}>{date}</div>
    </div>
  );
};

export default Title;
