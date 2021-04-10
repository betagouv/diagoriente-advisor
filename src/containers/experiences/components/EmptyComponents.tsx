import React from 'react';
import AddExp from 'assets/svg/Ajout_XP 1.svg';
import classes from '../experinces.module.scss';

const EmptyComponents = () => {
  return (
    <div className={classes.info}>
      <p className={classes.titleExp}>Ajouter une expérience</p>
      <p className={classes.subTitleExp}>
        Créez d’abord une expérience, reliez-la à un référentiel (RECTEC ou le vôte) et partagez-la à un groupe
      </p>
      <img src={AddExp} alt="" />
    </div>
  );
};

export default EmptyComponents;
