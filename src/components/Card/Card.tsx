import React from 'react';
import classNames from 'common/utils/classNames';
import style from './style.module.scss';

interface Props {
  className?: string;
  textCard: string | any;
  titleCard?: string;
  logo: string;
  backColor: string;
  logoLink: string;
}
const Card = ({ textCard, logo, className, backColor, logoLink, titleCard }: Props) => {
  return (
    <div className={classNames(style.cardContainer, className)} style={{ backgroundColor: backColor }}>
      <div className={style.logoContainer}>
        <a href={logoLink} target="blank" download>
          <img src={logo} alt=" " height={40} className={style.logo} />
        </a>
      </div>
      <div className={style.textCard}>
        <div className={style.titleContainer}>{titleCard}</div>
        <div className={style.textContainer}>{textCard}</div>
      </div>
    </div>
  );
};
export default Card;
