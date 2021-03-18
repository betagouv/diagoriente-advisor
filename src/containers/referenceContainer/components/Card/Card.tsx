import React from 'react';
import Button from 'components/Button/Button';
import { useHistory } from 'react-router-dom';
import classes from './card.module.scss';

interface IProps {
  competences?: { title: string; value: number; color: string }[];
  nom: string;
  info: string;
  img?: string;
}
const Card = ({ competences, nom, info, img }: IProps) => {
  const history = useHistory();
  const onNavigate = () => history.push('/reference/add');
  return (
    <div className={classes.cardContainer}>
      {img ? (
        <div className={classes.ContainerImg}>
          <img src={img} alt="" />
        </div>
      ) : (
        <div>
          {competences?.map((c) => {
            return (
              <div key={c.title} className={classes.headerCardRow}>
                <span className={classes.competenceTitle} style={{ color: c.color }}>
                  {c.title}
                </span>
                <div className={classes.competenceValue} style={{ color: c.color }}>
                  <span className={classes.competenceValueText}>{c.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className={classes.titleRef}>{nom}</p>
      <p className={classes.infoRef}>{info}</p>
      <div className={classes.btnContainer}>
        <Button label="sélectionner" onClick={onNavigate} />
      </div>
    </div>
  );
};

export default Card;
