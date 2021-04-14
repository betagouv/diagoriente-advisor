import React, { useContext, useState, useEffect } from 'react';
// requests
import useRecentJoined from 'common/containers/groupe/RecentJoined';
import useRecentSkills from 'common/containers/parcours/recentSkills';
import useStatJobs from 'common/containers/statistique/useStatJobs';
import { useLogout } from 'common/requests/auth';
import classNames from 'common/utils/classNames';
import Logout from 'assets/svg/logout.svg';

// hooks
import { useDidMount } from 'common/hooks/useLifeCycle';
// context
import userContext from 'common/contexts/UserContext';
// components
import Title from 'components/Title/Title';
// import Button from 'components/Button/Button';

// assets
import Invitation from 'assets/svg/invitationWomen.svg';
import Jobs from 'assets/svg/jobsHome.svg';
import Exp from 'assets/svg/expHome.svg';
// ez

import { setAuthorizationBearer, client } from 'common/requests/client';
import localforage from 'localforage';
// local component
import { Redirect } from 'react-router-dom';
import LookUp from 'assets/svg/lookUp.svg';
import Bandeau from './components/Bandeau/Bandeau';
import Box from './components/Box/Box';
import classes from './style.module.scss';

const HomeContainer = () => {
  const { user, setUser } = useContext(userContext);
  const [selectedFilter, SetelectedFilter] = useState<{ text: string; title: string }>({ text: '', title: '' });
  const [filtredStat, setFiltredStat] = useState<any[] | undefined>([]);
  const [filtredSkills, setFiltredSkills] = useState<any[] | undefined>([]);
  const [isEmptyStat, setIsEmptyStat] = useState(true);
  const [isEmptySKills, setIsEmptySKills] = useState(true);

  const { getRecentJoinedCall, data } = useRecentJoined();
  const { getListJobsStatCall, dataJobs } = useStatJobs();
  const { recentUserSkillsCall, dataRecentSkills } = useRecentSkills();
  const [logoutCall, logoutState] = useLogout();

  useDidMount(() => {
    if (user) {
      getRecentJoinedCall();
      getListJobsStatCall();
      recentUserSkillsCall();
    }
  });

  useEffect(() => {
    if (dataRecentSkills) {
      setFiltredSkills(dataRecentSkills);
    }
  }, [dataRecentSkills]);
  useEffect(() => {
    if (dataJobs) {
      setFiltredStat(dataJobs);
    }
  }, [dataJobs]);
  useEffect(() => {
    if (selectedFilter.text) {
      switch (selectedFilter.title) {
        case 'Recherches': {
          let filtredArrayLocal:
            | {
                user: {
                  profile: {
                    firstName: string;
                    lastName: string;
                  };
                  logo: string;
                };
                info: {
                  text: string;
                  date: Date;
                  type: string;
                };
              }[]
            | undefined = [];
          if (selectedFilter.text === 'APPRENTISSAGE') {
            filtredArrayLocal = dataJobs?.filter((el) => el.info.type === 'formation');
          } else if (selectedFilter.text === 'IMMERSION') {
            filtredArrayLocal = dataJobs?.filter((el) => el.info.type === 'entreprise');
          } else {
            filtredArrayLocal = dataJobs;
          }
          setFiltredStat(filtredArrayLocal);
          break;
        }
        case 'Expériences': {
          let filtredArrayLocal:
            | {
                info: { theme: { title: string; type: string }; createdAt: string };
                user: { profile: { firstName: string; lastName: string }; logo: string };
              }[]
            | undefined = [];
          if (selectedFilter.text === 'PROFESSIONNELLE') {
            filtredArrayLocal = dataRecentSkills.filter((s: any) => s.info.theme.type === 'professional');
          } else if (selectedFilter.text === 'PERSONNELLE') {
            filtredArrayLocal = dataRecentSkills.filter((s: any) => s.info.theme.type === 'personal');
          } else if (selectedFilter.text === 'ENGAGEMENT') {
            filtredArrayLocal = dataRecentSkills.filter((s: any) => s.info.theme.type === 'engagement');
          } else if (selectedFilter.text === 'SPORT') {
            filtredArrayLocal = dataRecentSkills.filter((s: any) => s.info.theme.type === 'sport');
          } else {
            filtredArrayLocal = dataRecentSkills;
          }
          setFiltredSkills(filtredArrayLocal);
          break;
        }
        default: {
          setFiltredSkills([]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter.text]);

  useEffect(() => {
    if (dataJobs?.length === 0) {
      setIsEmptyStat(true);
    } else setIsEmptyStat(false);
  }, [dataJobs]);
  useEffect(() => {
    if (dataRecentSkills?.length === 0) {
      setIsEmptySKills(true);
    } else setIsEmptySKills(false);
  }, [dataRecentSkills]);
  const logout = () => {
    logoutCall();
  };
  useEffect(() => {
    if (logoutState.data) {
      localforage.removeItem('auth');
      setAuthorizationBearer('');
      setUser(null);
      localStorage.clear();
      client.clearStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutState.data]);
  if (!user) {
    return <Redirect to="/login" />;
  }
  if (user.isActive && user.tutorialStep !== 5) {
    return <Redirect to="/tutorial" />;
  }
  return (
    <div className={classNames(classes.container_home, !user.isActive && classes.addPadding)}>
      <Title title="Tableau de bord" />
      {!user.isActive && (
        <div className={classes.btn_container}>
          <img src={Logout} alt="logout" className={classes.logOutIcon} onClick={logout} />
        </div>
      )}

      <Bandeau
        warningMessage={!user?.isActive}
        img={LookUp}
        title="Bienvenue"
        description={
          data?.length !== 0 || dataRecentSkills?.length !== 0 || dataJobs?.length !== 0
            ? `Voici les nouvelles à propos des personnes que vous suivez`
            : `Vous pouvez suivre les personnes que vous accompagnez 
            depuis cet espace (comptes activés, expériences ajoutées et recherches de métiers ou de formations).`
        }
        data={[data?.length, dataRecentSkills?.length, dataJobs?.length]}
      />
      <div className={classes.box_container}>
        <Box
          title="Parcours"
          bigTitle="En attente"
          descriptopn="Personne n’a encore accepté d’invitation à rejoindre le groupe."
          link="Envoyez des invitations"
          image={Invitation}
          data={data?.slice().reverse() || []}
          slicedData={
            data?.length && data?.length > 6
              ? data?.slice(data?.length - 6).reverse() || []
              : data?.slice().reverse() || []
          }
          message="a rejoint le groupe"
          SetelectedFilter={SetelectedFilter}
          selectedFilter={selectedFilter.title === 'Parcours' ? selectedFilter.text : 'Tout'}
          isActive={user.isActive}
        />
        <Box
          title="Expériences"
          bigTitle="Vide"
          descriptopn="Personne n’a encore ajouté d’expérience."
          link="En savoir plus"
          image={Exp}
          data={filtredSkills?.slice().reverse() || []}
          slicedData={
            filtredSkills?.length && filtredSkills?.length > 6
              ? filtredSkills?.slice(filtredSkills?.length - 6).reverse() || []
              : filtredSkills?.slice().reverse() || []
          }
          message="a ajouté une expérience"
          filters={['TOUT', 'PROFESSIONNELLE', 'PERSONNELLE', 'ENGAGEMENT', 'SPORT']}
          SetelectedFilter={SetelectedFilter}
          isActive={user.isActive}
          isEmpty={isEmptySKills}
          selectedFilter={selectedFilter.title === 'Expériences' ? selectedFilter.text : 'Tout'}
        />
        <Box
          title="Recherches"
          bigTitle="Métiers"
          descriptopn="Personne n’a encore fait de recherche métier."
          link="En savoir plus"
          image={Jobs}
          message="a recherché"
          data={filtredStat?.slice().reverse() || []}
          slicedData={
            filtredStat?.length && filtredStat?.length > 6
              ? filtredStat?.slice(filtredStat?.length - 6).reverse() || []
              : filtredStat?.slice().reverse() || []
          }
          filters={['TOUT', 'IMMERSION', 'APPRENTISSAGE']}
          SetelectedFilter={SetelectedFilter}
          selectedFilter={selectedFilter.title === 'Recherches' ? selectedFilter.text : 'Tout'}
          isActive={user.isActive}
          isEmpty={isEmptyStat}
        />
      </div>
    </div>
  );
};

export default HomeContainer;
