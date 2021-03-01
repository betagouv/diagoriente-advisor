import { useEffect, useState, useContext } from 'react';
import UserContext from 'common/contexts/UserContext';
import { useConfirmationAdvisor } from 'common/requests/user';
import { useDidMount } from 'common/hooks/useLifeCycle';
import localforage from 'localforage';
import { Redirect } from 'react-router-dom';
import { User } from 'common/requests/types';

const ConfirmationAdvisor = () => {
  const { setUser } = useContext(UserContext);
  const [opUpdateCall, onUpdateState] = useConfirmationAdvisor();
  const [updated, setUpdate] = useState(false);

  const updateUserdata = async (newData: User) => {
    const token: string | null = await localforage.getItem('auth');
    const res = {};
    if (token) {
      const parsedToken = JSON.parse(token);
      let newObj = {};
      const objUser = newData;
      newObj = {
        token: parsedToken.token,
        user: objUser,
      };
      await localforage.setItem('auth', JSON.stringify(newObj));
      setUser(objUser);
    }
    return res;
  };

  useDidMount(() => {
    opUpdateCall({ variables: { isActive: true } });
  });
  useEffect(() => {
    if (onUpdateState.data) {
      setUpdate(true);
      updateUserdata(onUpdateState.data.confirmation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUpdateState.data]);
  if (updated) {
    return <Redirect to="/tutorial" />;
  }
  return <div>Loding...</div>;
};

export default ConfirmationAdvisor;
