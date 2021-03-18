import React from 'react';
import style from './style.module.scss';

interface IProps {
  currentStepIndex: number;
  stepsTitle: string;
}

const StepTooltip = ({ currentStepIndex, stepsTitle }: IProps) => {
  return (
    <div className={style.currentStepContainer}>
      <span className={style.currentStepCercle} />
      <div className={style.currentStepRectangle}>
        <span className={style.currentNumber}>{currentStepIndex}</span>
        <span className={style.currentTitle}>{stepsTitle}</span>
      </div>
    </div>
  );
};

export default StepTooltip;
