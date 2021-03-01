/* eslint-disable max-len */
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import Flicking from '@egjs/react-flicking';
import { ChangeEvent } from '@egjs/flicking';
import { Fade } from '@egjs/flicking-plugins';
import classNames from 'common/utils/classNames';
import prevIcon from 'assets/svg/prevArrow.svg';
import nextIcon from 'assets/svg/nextArrow.svg';
import Card from 'components/Slider/CardPro/CardPro';
import { SkillType } from 'common/requests/types';
import style from './style.module.scss';

interface SliderProps {
  skills: Pick<SkillType, 'id' | 'theme' | 'activities' | 'createdAt' | 'engagement'>[];
  onChange: (e: ChangeEvent) => void;
  currentItem: number;
}

const Slider = ({ skills, onChange, currentItem }: SliderProps) => {
  const plugins = [new Fade()];
  const slider = useRef(null);

  const goToNext = () => {
    if (slider.current) {
      (slider.current as any)?.next();
    }
  };
  const goToPrevious = () => {
    if (slider.current) {
      (slider.current as any)?.prev();
    }
  };
  return (
    <div className={style.sliderContainer}>
      <div className={style.sliderContent}>
        {ReactDOM.createPortal(
          <div className={style.arrowRight}>
            <img src={prevIcon} onClick={goToPrevious} alt="" height={24} width={26} className={style.prevArrow} />
          </div>,
          document.getElementById('root') as HTMLDivElement,
        )}
        <div className={style.sliderWrapper}>
          {skills.length ? (
            <Flicking ref={slider} onChange={onChange} gap={0} circular duration={100} plugins={plugins}>
              {skills.map((skill, i: number) => {
                return (
                  <div key={skill.id} className={classNames(style.item, i === currentItem && style.current_item)}>
                    <Card
                      activities={
                        skill.theme.type === 'engagement'
                          ? skill.engagement?.options.map((o) => o.option.map((option) => option.title).join(' ')) || []
                          : skill.activities.map((activity) => activity.title)
                      }
                      title={skill.theme.title}
                      date={skill.createdAt}
                    />
                  </div>
                );
              })}
            </Flicking>
          ) : null}
        </div>
        {ReactDOM.createPortal(
          <div className={style.arrowLeft}>
            <img src={nextIcon} onClick={goToNext} alt=" " height={24} width={26} className={style.nextArrow} />
          </div>,
          document.getElementById('root') as HTMLDivElement,
        )}
      </div>
    </div>
  );
};
export default Slider;
