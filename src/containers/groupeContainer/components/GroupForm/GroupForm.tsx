import { FormEvent } from 'react';
import Button from 'components/Button/Button';
import Input from 'components/Form/Input/Input';

import { useForm } from 'common/hooks/useInputs';
import { Group } from 'common/requests/types';
import style from './styles.module.scss';
import CopyButton from '../CopyButton/CopyButton';
import InviteButton from '../InviteButton/InviteButton';

interface GroupValues {
  title: string;
}

interface GroupFormProps {
  onSubmit: (values: GroupValues) => void;
  data: { createGroup: Omit<Group, 'users'> };
  lastCreatedId: string | null;
  onInvite: (group: Group) => void;
}

const GroupForm = ({ onSubmit, data, lastCreatedId, onInvite }: GroupFormProps) => {
  const [state, actions] = useForm({ initialValues: { title: '' }, required: ['title'] });

  const { values } = state;
  const { handleChange } = actions;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(values);
  };

  if (data && data.createGroup.id !== lastCreatedId) {
    return (
      <div className={style.container}>
        <h2 className={style.title}>Votre groupe a été créé</h2>
        <div className={style.subtitle}>
          Invitez vos membres en leur partageant le code groupe en copiant/collant le code ou en cliquant sur le bouton
          inviter
        </div>
        <div className={style.content}>
          <span className={style.codeTitle}>CODE GROUPE : </span>
          <span className={style.codeValue}>{` ${data.createGroup.code}`}</span>
          <CopyButton code={data.createGroup.code} />
          <InviteButton
            onClick={() => {
              onInvite({ ...data.createGroup, users: [] });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <h2 className={style.title}>Ajouter groupe</h2>
      <form onSubmit={handleSubmit} className={style.inputGroupeStyle}>
        <Input
          value={values.title}
          onChange={handleChange}
          label="Nom du groupe"
          name="title"
          war={style.war}
          containerClassName={style.input}
          required
        />
        <Button label="valider" className={style.validerButton} />
      </form>

      <div className={style.link}>Besoin d’aide ?</div>
    </div>
  );
};

export default GroupForm;
