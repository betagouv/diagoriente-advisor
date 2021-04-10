import classNames from 'common/utils/classNames';
import style from './actionCard.module.scss';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  src: string;
  className?: string;
  srcStyle?: string;
  loading?: boolean;
}
const Card = ({ title, src, className, srcStyle, loading, ...rest }: Props) => {
  return (
    <div {...rest} className={classNames(style.container, className)}>
      <img src={src} className={srcStyle} alt="" />
      <div className={style.title}>{title}</div>
      {loading && <div className={style.loaderContainer} />}
    </div>
  );
};

export default Card;
