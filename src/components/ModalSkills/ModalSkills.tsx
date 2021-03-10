import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import Slider from 'components/Slider/Slider';
import { useGetSelectedUserParcour } from 'common/requests/parcours';

import { useCompetences } from 'common/requests/competences';

import style from './style.module.scss';

interface IProps {
  userId: string;
}
const ModalSkills = ({ userId }: IProps) => {
  const [getParcoursCall, getParcoursState] = useGetSelectedUserParcour();
  const [currentItem, setCurrentItem] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const [chartWidth, setChartWidth] = useState(0);
  const { data: competences } = useCompetences();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getParcoursCall({ variables: { idUser: userId } });
    // eslint-disable-next-line
  }, [userId]);

  // eslint-disable-next-line
  useEffect(() => {
    const { height, width } = chartContainerRef.current?.getBoundingClientRect() || {};
    if (height && chartHeight !== height) {
      setChartHeight(height - 40);
    }
    if (width && width !== chartWidth) setChartWidth(width - 40);
  });

  const skills = useMemo(() => {
    if (getParcoursState.data) {
      return getParcoursState.data.userParcour.skills;
    }
    return [];
  }, [getParcoursState.data]);

  const currentSkill = useMemo(() => {
    return skills[currentItem];
  }, [skills, currentItem]);

  const state = {
    series: [
      {
        name: 'Niveau',
        data:
          competences?.competences.data
            .filter((c) => c.type === (currentSkill?.theme.type === 'engagement' ? 'engagement' : 'default'))
            .map((competence) => currentSkill?.competences.find((c) => c._id.id === competence.id)?.value || 0) || [],
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
        background: {
          enabled: false,
          borderRadius: 2,
        },
      },
      fill: {
        colors: ['#FFFFFF', 'blue', '#F258454'],
      },
      chart: {
        type: 'radar',
        toolbar: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        max: 4,
        tickAmount: 4,
      },
      xaxis: {
        categories:
          competences?.competences.data
            .filter((c) => c.type === (currentSkill?.theme.type === 'engagement' ? 'engagement' : 'default'))
            .map((c) => {
              const s = c.title.split(' ');
              return s
                .reduce((result, row) => {
                  const lastRow = result[result.length - 1];
                  if (lastRow && lastRow.length < 3) lastRow.push(row);
                  else result.push([row]);
                  return result;
                }, [] as string[][])
                .map((r) => r.join(' '));
            }) || [],
        labels: {
          show: true,
          style: {
            colors: competences?.competences.data.map(() => '#10255E') || [],
            fontWeight: 'bold',
            fontStyle: 'Montserrat',
            rotate: -40,
            fontSize: '8px',
          },
        },
      },
      colors: ['#F12872'],
    },
  };

  const getSkillType = (type: string) => {
    switch (type) {
      case 'professional':
        return 'Expériences professionnelles';
      case 'engagement':
        return "Expériences d'engagement";
      default:
        return 'Expériences personnelles';
    }
  };

  return (
    <div className={style.modalContent}>
      <div className={style.chartContainer}>
        {currentSkill && <div className={style.titre}>{getSkillType(currentSkill.theme.type)}</div>}
        {currentSkill && (
          <div ref={chartContainerRef} className={style.chart}>
            <Chart
              options={state.options}
              series={state.series}
              type="radar"
              height={chartHeight * 0.75}
              width={chartWidth * 0.75}
            />
          </div>
        )}
      </div>
      <div className={style.sliderContent}>
        <Slider currentItem={currentItem} onChange={setCurrentItem} skills={skills} />
      </div>
    </div>
  );
};

export default ModalSkills;
