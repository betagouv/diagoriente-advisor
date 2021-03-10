import { useState, useContext, useEffect, useRef } from 'react';
import Title from 'components/Title/Title';

import { useGetSelectedUserParcour } from 'common/requests/parcours';
import { RouteComponentProps } from 'react-router-dom';
import { useJobs } from 'common/requests/jobs';
import Flicking from '@egjs/react-flicking';

import arrow from 'assets/svg/arrowSelect.svg';
import download from 'assets/svg/downloadArrow.svg';
import visualisation from 'assets/svg/visualisation.svg';
import { Jobs, SkillType } from 'common/requests/types';
import UserContext from 'common/contexts/UserContext';
import moment from 'moment';
import { Fade } from '@egjs/flicking-plugins';
import classNames from 'common/utils/classNames';
import ModalSkills from 'components/ModalSkills/ModalSkills';
import Modal from 'components/Modal/Modal';
import Progress1 from './components/progress/progress';
import ActionCard from './components/ActionCard';
import Card from './components/Card';
import style from './style.module.scss';
import Row from './components/Row';
import Experience from './components/Experience';

const detailProfilContainer = ({ match }: RouteComponentProps<{ id: string }>) => {
  const [jobsListCall, jobsListState] = useJobs();
  const [currentItem, setCurrentItem] = useState(0);

  const [getParcoursCall, getParcoursState] = useGetSelectedUserParcour();
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getParcoursCall({ variables: { idUser: match.params.id } });
    // eslint-disable-next-line
  }, [match.params.id]);
  useEffect(() => {
    if (getParcoursState.data) {
      jobsListCall({ variables: { parcourId: match.params.id } });
    }
    // eslint-disable-next-line
  }, [getParcoursState.data, match.params.id]);

  function formatSkill(skill: Pick<SkillType, 'activities' | 'id' | 'theme' | 'createdAt' | 'engagement' | 'comment'>) {
    return {
      id: skill.id,
      title: skill.theme.title,
      description:
        skill.theme.type === 'engagement'
          ? skill.engagement?.options.map((o) => o.option.map((option) => option.title).join(' ')) || []
          : skill.activities.map((activity) => activity.title),
      createdAt: skill.createdAt,
      comment: skill.comment,
    };
  }

  function filterAndFormatSkill(type: string) {
    return getParcoursState.data?.userParcour.skills.filter((skill) => skill.theme.type === type).map(formatSkill);
  }

  const families = getParcoursState.data?.userParcour.families.reduce((result, family) => {
    const lastRow = result[result.length - 1];
    if (!lastRow || lastRow.length === 2) return [...result, [family]];
    lastRow.push(family);
    return result;
  }, [] as { id: string; nom: string; category: string; resources: string[] }[][]);

  const prof = filterAndFormatSkill('professional');
  const personal = filterAndFormatSkill('personal');
  const engagement = filterAndFormatSkill('engagement');
  const sport = filterAndFormatSkill('sport');
  const plugins = [new Fade()];
  const slider = useRef(null);

  const jobs = jobsListState.data?.myJobs.reduce((result, row) => {
    const lastRow = result[result.length - 1];
    if (lastRow && lastRow.length < 4) lastRow.push(row);
    else result.push([row]);
    return result;
  }, [] as Jobs[][]);

  const { logo, email, createdAt } = getParcoursState.data?.userParcour?.userId || {};
  const { firstName, lastName } = getParcoursState.data?.userParcour?.userId.profile || { firstName: '', lastName: '' };
  const format = 'DD/MM/YYYY';

  const change = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    if (slider.current) {
      (slider.current as any)?.moveTo(index);
    }
    // setCurrentItem(index);
  };

  return (
    <div className={style.container}>
      <Title title="Fiche profil" />
      <div className={style.content}>
        <div className={style.firstContent}>
          <div className={style.profilContainer}>
            {logo ? <img src={logo} height={210} width={210} alt="" /> : null}
            <div className={style.profilContent}>
              <div className={style.name}>{`${firstName}  ${lastName}`}</div>
              <div className={style.description}>
                <Row title={email} />
                <Row title={`${user?.profile.firstName} ${user?.profile.lastName}`} />
                <Row title={`inscrit de puis le ${moment(createdAt).format(format)}`} />
              </div>
            </div>
          </div>
          <div className={style.parcourContainer}>
            <div className={style.compContainer}>
              {getParcoursState.data?.userParcour.globalCompetences && (
                <div className={style.titleExp}>Compétences transversales</div>
              )}
              <div className={style.compContent}>
                {getParcoursState.data?.userParcour.globalCompetences
                  .filter((c) => c.type === 'default')
                  .map((i) => (
                    <div className={style.compRow}>
                      <div className={style.comptitle}>{i.title}</div>
                      <Progress1 key={i.id} frontWidth={`${i.value * 25}%`} />
                    </div>
                  ))}
              </div>
              {families?.length ? <div className={style.titleExp}>Centres d’intérêt</div> : null}
              <div className={style.interestContainer}>
                {families?.map((familyRow) => {
                  return familyRow.map((family) => (
                    <div className={style.expPart1}>
                      <img src={family.resources[2]} alt="" className={style.interest} />
                      <div className={style.avatarsTitle}>
                        {family.nom.split('/').map((s) => (
                          <div className={style.subText}>{s.trim()}</div>
                        ))}
                      </div>
                    </div>
                  ));
                })}
              </div>
            </div>
            <div className={style.experienceContainer}>
              <Experience
                data={prof}
                slicedData={prof?.slice(prof?.length - 3).reverse() || []}
                title="Expériences professionnelles"
              />
              <Experience
                data={personal}
                slicedData={personal?.slice(personal?.length - 3).reverse() || []}
                title="Expériences personnelles"
              />
              <Experience
                data={engagement}
                slicedData={engagement?.slice(engagement?.length - 3).reverse() || []}
                title="Expériences d’engagement"
              />
              <Experience data={sport} slicedData={sport?.slice(sport?.length - 3).reverse() || []} title="Sport" />
            </div>
          </div>
        </div>
        <div className={style.secondContent}>
          <div className={style.title}>Action</div>
          <ActionCard srcStyle={style.srcStyle} title={'télécharger'.toUpperCase()} src={download} />
          <ActionCard
            onClick={() => setOpen(true)}
            className={style.actionCard}
            srcStyle={style.srcSecondStyle}
            title={'Visualisation Diagoriente'.toUpperCase()}
            src={visualisation}
          />
          <div className={style.cardContainer}>
            <div className={style.cardTitle}>Recherches</div>
            <div className={style.secondCol}>
              <div className={style.cardTitle}>FILTRE</div>
              <img src={arrow} alt="" />
            </div>
          </div>
          {jobs && jobs.length ? (
            <div className={style.sliderContainer}>
              <Flicking
                ref={slider}
                onChange={(e) => setCurrentItem(e.index)}
                gap={20}
                circular
                duration={100}
                plugins={plugins}
                draggable
                pageDots
                zIndex={0}
                moveType={{ type: 'snap', count: 1 }}
              >
                {jobs.map((job) => (
                  <div className={style.cardRoot}>
                    {job.map((j) => (
                      <Card title={j.title} description={j.description} />
                    ))}
                  </div>
                ))}
              </Flicking>
              <div className={style.circleContainer}>
                {jobs.map((e, index) => (
                  <div
                    className={classNames(style.circle, currentItem === index && style.secondCircle)}
                    onClick={(event) => change(event, index)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Modal backdropClassName={style.modal} wrapper={style.modal} isOpen={open} onClose={() => setOpen(false)}>
        <ModalSkills userId={match.params.id} />
      </Modal>
    </div>
  );
};

export default detailProfilContainer;
