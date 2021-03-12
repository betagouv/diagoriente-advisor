import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import recomm from 'assets/svg/recommendation.svg';
import recomHover from 'assets/svg/recommendationHover.svg';
import recomHand from 'assets/svg/recommendationHand.svg';
import recomHandHover from 'assets/svg/recommendationHandHover.svg';
import useOnclickOutside from 'common/hooks/useOnclickOutside';
/* import Tooltip from 'rc-tooltip'; */
import 'rc-tooltip/assets/bootstrap_white.css';
import style from './experience.module.scss';
import TitleRow from './Title';

interface PropsSkill {
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
}
interface Props {
  data?: PropsSkill[];
  slicedData?: PropsSkill[];
  title: string;
}
const format = 'MMM YYYY';

const Experience = ({ data, slicedData, title }: Props) => {
  const [seeAllPro, setSeeAllPro] = useState(false);
  const [seeAllPerso, setSeeAllPerso] = useState(false);
  const [seeAllEng, setSeeAllEng] = useState(false);
  const [seeAllSport, setSeeAllSport] = useState(false);
  const [displayedData, setDisplayedData] = useState<PropsSkill[] | undefined>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const divTooltip = useRef<HTMLDivElement>(null);
  useOnclickOutside(divTooltip, () => setIsOpen(false));

  const onClickSeeAll = () => {
    if (title === 'Expériences professionnelles') {
      setSeeAllPro(true);
    } else if (title === 'Expériences personnelles') {
      setSeeAllPerso(true);
    } else if (title === 'Expériences d’engagement') {
      setSeeAllEng(true);
    } else if (title === 'Expériences sportives') {
      setSeeAllSport(true);
    }
  };

  useEffect(() => {
    if (title === 'Expériences professionnelles') {
      if (seeAllPro) setDisplayedData(data);
      else setDisplayedData(slicedData);
    }
  }, [title, data, seeAllPro]);
  useEffect(() => {
    if (title === 'Expériences personnelles') {
      if (seeAllPerso) setDisplayedData(data);
      else setDisplayedData(slicedData);
    }
  }, [title, data, seeAllPerso]);
  useEffect(() => {
    if (title === 'Expériences d’engagement') {
      if (seeAllEng) setDisplayedData(data);
      else setDisplayedData(slicedData);
    }
  }, [title, data, seeAllEng]);
  useEffect(() => {
    if (title === 'Expériences sportives') {
      if (seeAllSport) setDisplayedData(data);
      else setDisplayedData(slicedData);
    }
  }, [title, data, seeAllSport]);

  return (
    <div className={style.container}>
      {displayedData?.length ? <div className={style.title}>{title}</div> : null}

      {displayedData?.map((j) => {
        return (
          <>
            <div key={j.id} className={style.row}>
              <TitleRow title={j.title} date={moment(j.createdAt).format(format)} />
              {j.comment?.map(
                (c) =>
                  c.status === 'accepted' && (
                    <div
                      className={style.recommendation}
                      onMouseEnter={() => setIsHover(true)}
                      onMouseLeave={() => setIsHover(false)}
                      onClick={() => setIsOpen(true)}
                    >
                      <img
                        className={style.icon}
                        src={
                          // eslint-disable-next-line
                          title === 'Expériences d’engagement'
                            ? !isHover
                              ? recomm
                              : recomHover
                            : !isHover
                            ? recomHand
                            : recomHandHover
                        }
                        alt=""
                      />
                      {/*   <Tooltip
                        overlayClassName={style.tooltip}
                        placement="top"
                        overlay={c.commentText}
                        arrowContent={<div className="rc-tooltip-arrow-inner" />}
                      > */}
                      <span className={style.text}>{`Recommandé par ${c.firstName} ${c.lastName}`}</span>
                      {/* </Tooltip> */}
                      {isOpen && (
                        <div className={style.tooltip} ref={divTooltip}>
                          {c.commentText}
                        </div>
                      )}
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
      {displayedData &&
        displayedData?.length !== 0 &&
        slicedData?.length === 3 &&
        ((title === 'Expériences professionnelles' && !seeAllPro) ||
          (title === 'Expériences personnelles' && !seeAllPerso) ||
          (title === 'Expériences d’engagement' && !seeAllEng) ||
          (title === 'Expériences sportives' && !seeAllSport)) && (
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
