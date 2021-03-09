/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useContext } from 'react';
import Title from 'components/Title/Title';
import userContext from 'common/contexts/UserContext';
import { useUpdateUser } from 'common/requests/user';
import useUpdateUserInfo from 'utils/UpdateUserData';
import style from './style.module.scss';

const FormationContainer = () => {
  const { user } = useContext(userContext);
  const [updateTutoCall, updateTutoState] = useUpdateUser();

  if (user?.isActive && user.tutorialStep === 0) {
    updateTutoCall({ variables: { tutorialStep: 1 } });
  }

  useUpdateUserInfo(updateTutoState.data?.updateUser);

  return (
    <div className={style.formationContainer}>
      <Title title="Formation" />

      <iframe
        className={style.formationContainer}
        src="https://diagoriente.beta.gouv.fr/formation-diagoriente"
        style={{
          height: '100vh',
          width: 'calc(100vw - 24vw)',
          overflowY: 'hidden',
          border: 'none',
          borderRadius: 15,
          marginTop: 30,
        }}
      />
    </div>
  );
};

export default FormationContainer;
