import { FormEvent, useEffect, useContext } from 'react';
import Button from 'components/Button/Button';
import Input from 'components/Form/Input/Input';
import userContext from 'common/contexts/UserContext';
import { useUpdateUser } from 'common/requests/user';
import useUpdateUserInfo from 'utils/UpdateUserData';
import { useForm } from 'common/hooks/useInputs';
import { Group } from 'common/requests/types';
import { useInviteToGroup } from 'common/requests/groupes';
import useSnackBar from 'common/hooks/useSnackBar';
import style from './styles.module.scss';

interface GroupFormProps {
  group: Group;
  onRequestClose?: () => void;
}

const InviteUser = ({ group, onRequestClose }: GroupFormProps) => {
  const { user } = useContext(userContext);
  const [updateTutoCall, updateTutoState] = useUpdateUser();
  const { open } = useSnackBar();
  const [state, actions] = useForm({ initialValues: { email: '' } });
  const [inviteToGroup, { data }] = useInviteToGroup();
  const { values } = state;
  const { handleChange } = actions;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inviteToGroup({ variables: { code: group.code, email: values.email.trim() } });
    if (user?.tutorialStep === 2) {
      updateTutoCall({ variables: { tutorialStep: 3 } });
    }
  };

  useEffect(() => {
    if (data && onRequestClose) {
      open(data.inviteToGroup, 'success');
      onRequestClose();
    }
    // eslint-disable-next-line
  }, [data]);
  useUpdateUserInfo(updateTutoState.data?.updateUser);

  return (
    <div className={style.container}>
      <h2 className={style.title}>{`Inviter à ${group.title}`}</h2>
      <form onSubmit={handleSubmit} className={style.inputGroupeStyle}>
        <Input
          value={values.email}
          onChange={handleChange}
          label="Email"
          name="email"
          containerClassName={style.input}
          required
        />
        <Button label="valider" className={style.validerButton} />
      </form>
    </div>
  );
};

export default InviteUser;
