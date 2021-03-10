import { useState, useEffect } from 'react';
import moment from 'moment';
import recommendation from 'assets/svg/recommendation.svg';
import recommendationH from 'assets/svg/recommendationHand.svg';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import style from './experience.module.scss';
import TitleRow from './Title';

interface Props {
  data?: {
    id: string;
    title: string;
    description: string[];
    createdAt: string;
    comment?: {
      id: string;
      lastName: string;
      firstName: string;
      commentText: string;
      status: 'pending' | 'accepted' | 'refused';
      email: string;
      institution: string;
      location: string;
    }[];
  }[];
  slicedData?: any;
  title: string;
}
const format = 'MMM YYYY';

const Experience = ({ data, slicedData, title }: Props) => {
  const [seeAllPro, setSeeAllPro] = useState(true);
  const [seeAllPerso, setSeeAllPerso] = useState(false);
  const [seeAllEng, setSeeAllEng] = useState(false);
  const [displayedData, setDisplayedData] = useState([]);
  const dataArray: any = [data];
  const seeAllArray: any = [];
  console.log('dataExperience', data);
  console.log('array', dataArray);
  console.log('displayedData', displayedData);
  const onClickSeeAll = () => {
    if (title === 'Expériences professionnelles') {
      setSeeAllPro(true);
      seeAllArray.push('pro');
    } else if (title === 'Expériences personnelles') {
      setSeeAllPerso(true);
      seeAllArray.push('perso');
    } else if (title === 'Expériences d’engagement') {
      setSeeAllEng(true);
      seeAllArray.push('eng');
    }
  };

  useEffect(() => {
    if (title === 'Expériences professionnelles') if (!seeAllPro) setDisplayedData(slicedData);
  }, [title, data, seeAllPro]);
  useEffect(() => {
    if (title === 'Expériences personnelles') if (!seeAllPerso) setDisplayedData(slicedData);
  }, [title, data, seeAllPerso]);
  useEffect(() => {
    if (title === 'Expériences d’engagement') if (!seeAllEng) setDisplayedData(slicedData);
  }, [title, data, seeAllEng]);
  return (
    <div className={style.container}>
      {data?.length ? <div className={style.title}>{title}</div> : null}

      {data?.slice(0, 3).map((j) => {
        return (
          <>
            <div key={j.id} className={style.row}>
              <TitleRow title={j.title} date={moment(j.createdAt).format(format)} />
              {j.comment?.map(
                (c) =>
                  c.status === 'accepted' && (
                    <div className={style.recommendation}>
                      <img
                        className={style.icon}
                        src={title === 'Expériences d’engagement' ? recommendation : recommendationH}
                        alt=""
                      />
                      <Tooltip
                        overlayClassName={style.tooltip}
                        placement="bottom"
                        overlay={c.commentText}
                        arrowContent={<div className="rc-tooltip-arrow-inner" />}
                      >
                        <span className={style.text}>{`Recommandé par ${c.firstName} ${c.lastName}`}</span>
                      </Tooltip>
                    </div>
                  ),
              )}
              <div className={style.description}>
                {j.description.map((description) => (
                  <div className={style.descriptionContent}>{description}</div>
                ))}
              </div>
            </div>
          </>
        );
      })}
      {data && data?.length > 3 && (
        <div className={style.button_box}>
          <div className={style.seeAll} onClick={onClickSeeAll}>
            voir tout
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;
