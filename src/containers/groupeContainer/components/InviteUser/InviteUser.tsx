/* eslint-disable max-len */
import { FormEvent, useEffect, useContext, useState } from 'react';
import Button from 'components/Button/Button';
import Input from 'components/Form/Input/Input';
import userContext from 'common/contexts/UserContext';
import { useUpdateUser } from 'common/requests/user';
import useUpdateUserInfo from 'utils/UpdateUserData';
import { useForm } from 'common/hooks/useInputs';
import { Group } from 'common/requests/types';
import { useInviteToGroup } from 'common/requests/groupes';
import useSnackBar from 'common/hooks/useSnackBar';
import { validateEmail } from 'common/utils/validation';

import style from './styles.module.scss';

interface GroupFormProps {
  group: Group;
  onRequestClose?: () => void;
}

const InviteUser = ({ group, onRequestClose }: GroupFormProps) => {
  const { user } = useContext(userContext);
  const [updateTutoCall, updateTutoState] = useUpdateUser();
  const [errorMsg, setErrorMsg] = useState('');

  const { open } = useSnackBar();
  const [state, actions] = useForm({
    initialValues: { email: '', acceptCondition: false },
    validation: {
      email: validateEmail,
    },
    required: ['email'],
  });
  const [inviteToGroup, inviteToGroupState] = useInviteToGroup();
  const { values } = state;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(`${values.email}`.toLowerCase())) {
      setErrorMsg('');
    } else setErrorMsg(' Votre adresse e-mail doit contenir @');

    inviteToGroup({ variables: { code: group.code, email: values.email.trim() } });
    if (user?.tutorialStep === 2) {
      updateTutoCall({ variables: { tutorialStep: 3 } });
    }
  };

  useEffect(() => {
    if (inviteToGroupState.data && onRequestClose) {
      open(inviteToGroupState.data.inviteToGroup, 'success');
      onRequestClose();
    }
    // eslint-disable-next-line
  }, [inviteToGroupState.data]);
  useUpdateUserInfo(updateTutoState.data?.updateUser);

  return (
    <div className={style.container}>
      <h2 className={style.title}>{`Inviter dans le groupe ${group.title}`}</h2>
      <div className={style.error}>{errorMsg}</div>
      <form onSubmit={handleSubmit} className={style.inputGroupeStyle}>
        <Input
          value={values.email}
          onChange={actions.handleChange}
          label="Email"
          name="email"
          war={style.war}
          containerClassName={style.input}
          required
        />
        <Button label="valider" disable={inviteToGroupState.loading} loader={inviteToGroupState.loading} />
      </form>
    </div>
  );
};

export default InviteUser;
