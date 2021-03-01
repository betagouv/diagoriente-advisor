import style from './row.module.scss';

interface Props {
  title: React.ReactNode;
}
const Row = ({ title }: Props) => {
  return (
    <div className={style.container}>
      <div className={style.circle} />
      <div className={style.title}>{title}</div>
    </div>
  );
};

export default Row;
