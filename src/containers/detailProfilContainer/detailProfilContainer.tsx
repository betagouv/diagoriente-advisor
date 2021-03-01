import { useContext, useEffect } from 'react';
import Title from 'components/Title/Title';

import { useGetSelectedUserParcour } from 'common/requests/parcours';
import { RouteComponentProps } from 'react-router-dom';

import arrow from 'assets/svg/arrowSelect.svg';
import download from 'assets/svg/downloadArrow.svg';
import visualisation from 'assets/svg/visualisation.svg';
import { SkillType } from 'common/requests/types';
import UserContext from 'common/contexts/UserContext';
import moment from 'moment';
import Progress1 from './components/progress/progress';
import ActionCard from './components/ActionCard';
import Card from './components/Card';
import style from './style.module.scss';
import Row from './components/Row';
import Experience from './components/Experience';

const detailProfilContainer = ({ match }: RouteComponentProps<{ id: string }>) => {
  const [getParcoursCall, getParcoursState] = useGetSelectedUserParcour();
  const { user } = useContext(UserContext);
  useEffect(() => {
    getParcoursCall({ variables: { idUser: match.params.id } });
    // eslint-disable-next-line
  }, [match.params.id]);

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

  const { logo, email, createdAt } = getParcoursState.data?.userParcour?.userId || {};
  const { firstName, lastName } = getParcoursState.data?.userParcour?.userId.profile || { firstName: '', lastName: '' };
  const format = 'DD/MM/YYYY';
  return (
    <div className={style.container}>
      <Title title="Fiche profil" />
      <div className={style.content}>
        <div className={style.firstContent}>
          <div className={style.profilContainer}>
            <img src={logo} height={210} width={210} alt="" />
            <div className={style.profilContent}>
              <div className={style.name}>{`${firstName}  ${lastName}`}</div>
              <div className={style.description}>
                <Row title={email} />
                <Row title={`${user?.profile.firstName} ${user?.profile.lastName}`} />
                <Row title={`inscrit de puis le ${moment(createdAt).format(format)}`} />
                <Row title="CAP" />
              </div>
            </div>
          </div>
          <div className={style.parcourContainer}>
            <div className={style.compContainer}>
              <div className={style.titleExp}>Compétences transversales</div>
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
              <div className={style.titleExp}>Centres d’intérêt</div>
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
              <Experience data={prof} title="Expériences professionnelles" />
              <Experience data={personal} title="Expériences personnelles" />
              <Experience data={engagement} title="Expériences d’engagement" />
              <Experience data={sport} title="Sport" />
            </div>
          </div>
        </div>
        <div className={style.secondContent}>
          <div className={style.title}>Action</div>
          <ActionCard srcStyle={style.srcStyle} title={'télécharger'.toUpperCase()} src={download} />
          <ActionCard
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
          <div className={style.cardRoot}>
            <Card
              title="Assistant/e commercial/e"
              description="Traitement des commandes, facturation, tenue du fichier clients, surveillance des"
              showView
            />
            <Card
              title="Assistant/e commercial/e"
              description="Traitement des commandes, facturation, tenue du fichier clients, surveillance des"
              showView
            />
            <Card
              title="Assistant/e commercial/e"
              description="Traitement des commandes, facturation, tenue du fichier clients, surveillance des"
              showView
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default detailProfilContainer;
