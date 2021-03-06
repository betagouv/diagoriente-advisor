/* eslint-disable default-case */
/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useContext, useEffect } from 'react';
import DrawerContext from 'common/contexts/DrawerContext';
import { setAuthorizationBearer, client } from 'common/requests/client';
import { useLogout } from 'common/requests/auth';
import userContext from 'common/contexts/UserContext';
import localforage from 'localforage';
import drawerLogo from 'assets/svg/drawerLogo.svg';
import Localisation from 'assets/svg/drawer/DrawerLocalisation';
import Groupes from 'assets/svg/drawer/DrawerGroupes';
import Formation from 'assets/svg/drawer/DrawerFormation';
import LivretActivite from 'assets/svg/drawer/DrawerAcitivite';
import Profil from 'assets/svg/drawer/DrawerProfil';
import Referentiel from 'assets/svg/drawer/DrawerReferentiel';
import Logout from 'assets/svg/logout.svg';
import Arrow from 'assets/svg/download.svg';
import Experience from 'assets/svg/drawer/DrawerExperince';
import { Link, useLocation, NavLink } from 'react-router-dom';
import classNames from 'common/utils/classNames';
import ProgressBar from 'containers/detailProfilContainer/components/progress/progress';
import StepContainer from './component/StepTooltip';
import style from './style.module.scss';

const PrivateDrawer = () => {
  const location = useLocation();
  const initialSelected = () => Number(window.localStorage.getItem('selectedButton') || -1);
  const [selectedButton, setSelectedButton] = useState(initialSelected);
  const [logoutCall, logoutState] = useLogout();

  const { open, setOpen } = useContext(DrawerContext);
  const { setUser, user } = useContext(userContext);
  const isActive = user?.isActive;

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedButton(index);
  };
  const toggle = () => {
    setSelectedButton(-1);
  };
  useEffect(() => {
    window.localStorage.setItem('selectedButton', JSON.stringify(selectedButton));
  }, [selectedButton]);
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
  let Links = [
    {
      text: 'Parcours',
      path: '/parcours',
      tutoText: ['Suivez les profils'],
      svg: <Localisation color={selectedButton === 1 ? '#10255e' : 'rgba(16, 37, 94, 0.6)'} />,
      id: 1,
    },
    {
      text: 'Groupes',
      path: '/groupes',
      tutoText: ['Cr??ez votre groupe', 'Envoyez une invitation'],
      svg: <Groupes color={selectedButton === 2 ? '#10255e' : 'rgba(16, 37, 94, 0.6)'} />,
      id: 2,
    },

    {
      text: 'Formation',
      path: '/formation',
      textTuto: ['Suivez la formation'],
      svg: <Formation color={selectedButton === 4 ? '#10255e' : 'rgba(16, 37, 94, 0.6)'} />,
      id: 4,
    },
    {
      text: 'Ressources',
      path: '/ressources',
      svg: <LivretActivite color={selectedButton === 5 ? '#10255e' : 'rgba(16, 37, 94, 0.6)'} />,
      id: 5,
    },
    {
      text: 'Mes exp??riences',
      path: '/experiences',
      svg: <Experience color={selectedButton === 6 ? '#10255e' : 'rgba(16, 37, 94, 0.6)'} />,
      id: 6,
    },

    {
      text: 'Mon compte',
      path: '/account',
      svg: <Profil color={selectedButton === 7 ? '#10255e' : 'rgba(16, 37, 94, 0.6)'} />,
      id: 7,
    },
  ];
  if (user?.isReferentiel && user.isReferentiel === true) {
    const arr = [
      ...Links.slice(0, Links.length - 1),
      {
        text: 'Mon r??f??rentiel',
        path: '/references',
        svg: <Referentiel color={selectedButton === 3 ? '#10255e' : 'rgba(16, 37, 94, 0.6)'} />,
        id: 3,
      },
      ...Links.slice(Links.length - 1),
    ];
    Links = arr;
  }
  const renderTooltip = (idLink: number) => {
    const id = user?.tutorialStep;
    let res = null;
    if (id === 3 && idLink === 1) res = <StepContainer currentStepIndex={id + 1} stepsTitle="Suivez les profils" />;
    if (id === 2 && idLink === 2) res = <StepContainer currentStepIndex={id + 1} stepsTitle="Envoyez une invitation" />;
    if (id === 1 && idLink === 2) res = <StepContainer currentStepIndex={id + 1} stepsTitle="Cr??ez votre groupe" />;
    if (id === 0 && idLink === 4) res = <StepContainer currentStepIndex={id + 1} stepsTitle="Suivez la formation" />;
    return res;
  };
  useEffect(() => {
    if (window.location.pathname === '/parcours' || window.location.pathname.slice(0, 9) === '/parcours') {
      setSelectedButton(1);
    }
    if (window.location.pathname === '/groupes') {
      setSelectedButton(2);
    }
    if (window.location.pathname === '/references') {
      setSelectedButton(3);
    }
    if (window.location.pathname === '/formation') {
      setSelectedButton(4);
    }
    if (window.location.pathname === '/ressources') {
      setSelectedButton(5);
    }
    if (window.location.pathname === '/account') {
      setSelectedButton(6);
    }
  }, [selectedButton, window.location.pathname]);
  return (
    <div className={classNames(style.drawerContainer, open && style.drawerContainerOpend)}>
      <div className={style.wrapperSideBar}>
        <div className={style.drawerHeader} onClick={() => toggle()}>
          <div className={style.menu} onClick={() => setOpen(!open)}>
            <img src={Arrow} alt="arrow" className={open ? style.closeArrow : style.arrow} />
          </div>
          <Link to="/">
            <img src={drawerLogo} alt="" className={style.diagImg} />
          </Link>
          <div className={style.headerTextContainer}>
            <Link to="/" className={style.headerText}>
              <p> Tableau de bord </p>
            </Link>
            <span className={style.headerSpan}>
              {isActive && user?.tutorialStep !== 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Link className={style.headerSpan} to={user?.tutorialStep === 4 ? '/' : '/tutorial'}>
                    {user?.tutorialStep === 4 ? (
                      <span className={style.progressDoneText}>C&apos;est parti</span>
                    ) : (
                      <span>D??marrage</span>
                    )}
                  </Link>
                  <div style={{ width: 200 }}>
                    <ProgressBar
                      frontWidth={user?.tutorialStep ? `${user.tutorialStep * 25}%` : '0'}
                      color={user?.tutorialStep === 4 ? style.progressDone : '#ff0060'}
                    />
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>
        <div className={style.drawerBody}>
          {Links.map((e) => {
            const p = window && window.location.pathname === e.path;
            return (
              <div
                key={e.id}
                onClick={(event) => handleListItemClick(event, e.id)}
                className={classNames(style.listContainer, e.id === selectedButton && style.selectedButton)}
              >
                <NavLink key={e.path} to={e.path} className={style.linkContainer} exact strict>
                  {e.svg}
                  <span
                    className={classNames(
                      style.path,
                      e.id === selectedButton && p && style.activeText,
                      open ? style.openedText : style.closedText,
                    )}
                  >
                    {e.text}
                  </span>
                  {location.pathname === '/tutorial' && renderTooltip(e.id)}
                </NavLink>
              </div>
            );
          })}
        </div>
        <div className={style.drawerFooter}>
          <p className={classNames(style.path, style.row)} onClick={logout}>
            <img src={Logout} alt="logout" className={style.logOutIcon} />
            <span className={classNames(open ? style.openedText : style.closedText)}> Se d??connecter </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivateDrawer;
