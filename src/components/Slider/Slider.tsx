/* eslint-disable max-len */
import React, { useRef } from 'react';
import Flicking from '@egjs/react-flicking';
import classNames from 'common/utils/classNames';
import prevIcon from 'assets/svg/prevArrow.svg';
import nextIcon from 'assets/svg/nextArrow.svg';
import Card from 'components/Slider/CardPro/CardPro';
import { SkillType } from 'common/requests/types';
import style from './style.module.scss';

interface SliderProps {
  skills: Pick<SkillType, 'id' | 'theme' | 'activities' | 'createdAt' | 'engagement'>[];
  onChange: (index: number) => void;
  currentItem: number;
}

const Slider = ({ skills, onChange, currentItem }: SliderProps) => {
  const slider = useRef<Flicking>(null);

  const goToNext = () => {
    if (slider.current && currentItem < skills.length - 1) {
      slider.current.moveTo(currentItem + 1);
    }
  };
  const goToPrevious = () => {
    if (slider.current && currentItem > 0) {
      slider.current.moveTo(currentItem - 1);
    }
  };
  return (
    <div className={style.sliderContainer}>
      <div className={style.sliderContent}>
        <div onClick={goToPrevious} className={style.arrowRight}>
          <img src={prevIcon} alt="" height={24} width={26} className={style.prevArrow} />
        </div>
        <div className={style.sliderWrapper}>
          {skills.length ? (
            <Flicking ref={slider} onChange={(e) => onChange(e.index)} gap={0} duration={100}>
              {skills.map((skill, i: number) => {
                const activities =
                  skill.theme.type === 'engagement'
                    ? skill.engagement?.options.map((o) => o.option.map((option) => option.title).join(' ')) || []
                    : skill.activities.map((activity) => activity.title);
                return (
                  <div key={skill.id} className={classNames(style.item, i === currentItem && style.current_item)}>
                    <Card
                      onClick={() => {
                        if (slider.current) {
                          slider.current.moveTo(i);
                        }
                      }}
                      activities={activities}
                      title={skill.theme.title}
                      date={skill.createdAt}
                    />
                  </div>
                );
              })}
            </Flicking>
          ) : null}
        </div>
        <div onClick={goToNext} className={style.arrowLeft}>
          <img src={nextIcon} alt=" " height={24} width={26} className={style.nextArrow} />
        </div>
      </div>
    </div>
  );
};
export default Slider;
