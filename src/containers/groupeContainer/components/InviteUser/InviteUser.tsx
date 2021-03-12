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
  const [error, setError] = useState('');

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

    inviteToGroup({ variables: { code: group.code, email: values.email.trim() } });
    if (user?.tutorialStep === 2) {
      updateTutoCall({ variables: { tutorialStep: 3 } });
    }
  };
  const callError = () => {
    if (state.errors.email !== '') setError(state.errors.email);
    else if (error === '') setError('');
  };
  useEffect(() => {
    if (inviteToGroupState.data && onRequestClose) {
      open(inviteToGroupState.data.inviteToGroup, 'success');
      onRequestClose();
    }
  }, [inviteToGroupState.data]);
  useUpdateUserInfo(updateTutoState.data?.updateUser);

  return (
    <div className={style.container}>
      <h2 className={style.title}>{`Inviter dans le groupe ${group.title}`}</h2>
      <div className={style.error}>{error}</div>
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
        <Button
          label="valider"
          disable={inviteToGroupState.loading}
          loader={inviteToGroupState.loading}
          onClick={() => {
            callError();
          }}
        />
      </form>
    </div>
  );
};

export default InviteUser;
