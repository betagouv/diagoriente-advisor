import React, { useState, useEffect, useContext } from 'react';
import Title from 'components/Title/Title';
import { useUpdateUser } from 'common/requests/user';
import userContext from 'common/contexts/UserContext';
import useUpdateUserInfo from 'utils/UpdateUserData';
import ImageTuto from 'assets/svg/TutoLogo';
import Step from './components/TutoStep/TutoStep';
import style from './style.module.scss';

const TutorialContainer = () => {
  const { user } = useContext(userContext);
  const [updateTutoCall, updateTutoState] = useUpdateUser();
  const [doneTutorial, setTutorial] = useState(true);
  const [currentStepIndex, setCurrentStepIdx] = useState<number>(0);
  useEffect(() => {
    if (user && user?.tutorialStep !== null) {
      setCurrentStepIdx(user.tutorialStep);
      const done = user?.tutorialStep >= 4;
      setTutorial(done);
    }
    if (user && user?.tutorialStep !== null && user?.tutorialStep === 4) {
      updateTutoCall({ variables: { tutorialStep: 5 } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tutorialStep]);
  useUpdateUserInfo(updateTutoState.data?.updateUser);
  const steps: {
    number: number;
    title: string;
  }[] = [
    {
      number: 1,
      title: 'Suivez la formation',
    },
    {
      number: 2,
      title: 'Créez votre groupe',
    },
    {
      number: 3,
      title: 'Envoyez une invitation',
    },
    {
      number: 4,
      title: 'Suivez les profils',
    },
  ];

  return (
    <div className={style.tutorialContainer}>
      <Title title="Tableau de board" />
      <div className={style.tutorialBox}>
        <div className={style.tutorialContent}>
          <div className={style.logo}>
            <ImageTuto color={doneTutorial ? '#E1F2F2' : '#FFE3EE'} width="1O0%" height="100%" />
          </div>
          <div className={style.title} style={{ color: doneTutorial ? '#3AB8BA' : '' }}>
            {doneTutorial ? 'Bravo!' : 'Bienvenue'}
          </div>
          <p className={style.subTitle}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
          </p>
          <div className={style.stepsContainer}>
            {steps.map((step) => {
              return (
                <Step
                  key={step.title}
                  number={step.number}
                  title={step.title}
                  finished={step.number <= currentStepIndex}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialContainer;
