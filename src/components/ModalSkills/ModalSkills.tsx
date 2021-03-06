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
  const renderText = (cp: string[], n: number) => {
    const description = competences?.competences?.data
      .filter((c) => {
        return c.title === cp.join(' ');
      })
      .filter(
        (el) =>
          (el.type === 'engagement' && currentSkill.theme.type === 'engagement') ||
          (el.type === 'default' && currentSkill.theme.type === 'personal') ||
          (el.type === 'default' && currentSkill.theme.type === 'professional'),
      )[0].niveau[n];
    return description;
  };
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
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
          const res = renderText(w.globals.labels[dataPointIndex], series[seriesIndex][dataPointIndex]);
          if (res) {
            return `<div style="padding:5px">
            <p style="padding-left:5"><b>${res?.title}</b></p>
            <p style="padding-left:5">${res?.sub_title}</p>
            </div>`;
          }
          return `<div style="padding:5px">
          <p style="padding-left:5"><b>${w.globals.labels[dataPointIndex]}</b></p>
          <p style="padding-left:5">niveau: ${series[seriesIndex][dataPointIndex]}</p>
          </div>`;
        },
      },
      colors: ['#F12872'],
    },
  };

  const getSkillType = (type: string) => {
    switch (type) {
      case 'professional':
        return 'Exp??riences professionnelles';
      case 'engagement':
        return "Exp??riences d'engagement";
      default:
        return 'Exp??riences personnelles';
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
              height={Math.min(chartHeight * 0.75, 600)}
              width={Math.min(chartWidth * 0.75, 600)}
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
