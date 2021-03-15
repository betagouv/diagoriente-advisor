import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import RecomIcon from 'assets/svg/Recommendation';
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
  }, [title, data, seeAllPro, slicedData]);
  useEffect(() => {
    if (title === 'Expériences personnelles') {
      if (seeAllPerso) setDisplayedData(data);
      else setDisplayedData(slicedData);
    }
  }, [title, data, seeAllPerso, slicedData]);
  useEffect(() => {
    if (title === 'Expériences d’engagement') {
      if (seeAllEng) setDisplayedData(data);
      else setDisplayedData(slicedData);
    }
  }, [title, data, seeAllEng, slicedData]);
  useEffect(() => {
    if (title === 'Expériences sportives') {
      if (seeAllSport) setDisplayedData(data);
      else setDisplayedData(slicedData);
    }
  }, [title, data, seeAllSport, slicedData]);

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
                      <RecomIcon width="16px" height="18px" color={isHover ? '#4b6bc4' : '#10255E'} />
                      {/*   <Tooltip
                        overlayClassName={style.tooltip}
                        placement="top"
                        overlay={c.commentText}
                        arrowContent={<div className="rc-tooltip-arrow-inner" />}
                      > */}
                      <span
                        className={style.text}
                        style={{ color: isHover ? '#4b6bc4' : '', stroke: isHover ? '#4b6bc4' : '' }}
                      >
                        {`Recommandé par ${c.firstName} ${c.lastName}`}
                      </span>
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
