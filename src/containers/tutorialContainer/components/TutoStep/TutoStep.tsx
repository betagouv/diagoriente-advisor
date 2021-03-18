import style from './style.module.scss';

interface Props {
  number: number;
  title: string;
  finished?: boolean;
}
const TutoStep = ({ number, title, finished }: Props) => {
  return (
    <div className={style.stepContainer} style={{ color: finished ? '#3AB8BA' : '' }}>
      <div className={style.number}>{number}</div>
      <div className={style.title}>{title}</div>
    </div>
  );
};
export default TutoStep;
