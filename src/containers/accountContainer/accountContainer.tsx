import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'common/hooks/useInputs';
import { useUpdateUser } from 'common/requests/user';
import userContext from 'common/contexts/UserContext';
import useUpdateUserInfo from 'utils/UpdateUserData';
import { validateEmail, validatePassword, isStringEmpty } from 'common/utils/validation';
import _ from 'lodash';
import Title from 'components/Title/Title';
import Input from 'components/Form/Input/Input';
import Button from 'components/Button/Button';
import style from './style.module.scss';

const AccountContainer = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmEmail, setConfirmationEmail] = useState('');
  const [confirmPassword, setConfirmationPassword] = useState('');
  const { user } = useContext(userContext);
  const [updateUser, updateUserState] = useUpdateUser();
  const [state, actions] = useForm({
    initialValues: {
      firstName: user ? user.profile.firstName : '',
      lastName: user ? user.profile.lastName : '',
      logo: '',
      email: user ? user.email : '',
      password: '',
      oldPassword: '',
      location: '',
      institution: user ? user.profile.institution : '',
      codeGroupe: '',
      acceptCondition: false,
    },
    validation: {
      firstName: isStringEmpty,
      lastName: isStringEmpty,
      email: validateEmail,
      password: validatePassword,
      oldPassword: isStringEmpty,
      institution: isStringEmpty,
      logo: isStringEmpty,
      location: isStringEmpty,
    },
    required: ['firstName', 'lastName', 'email', 'institution'],
  });
  const onChangeConfirmationEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setConfirmationEmail(value);
  };
  const onChangeConfirmationPassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setConfirmationPassword(value);
  };
  const { values } = state;
  /*  useEffect(() => {
    if (updateUserState.data) {
      setUser(updateUserState.data.updateUser);
    }
    // eslint-disable-next-line
  }, [updateUserState.data]); */
  useUpdateUserInfo(updateUserState.data?.updateUser);

  const callError = () => {
    if (confirmEmail !== '') {
      if (confirmEmail !== values.email) {
        return setErrorMsg('email non conform');
      }
    }
    if (confirmPassword !== values.password) {
      return setErrorMsg('mot de passe non conforme');
    }
    return setErrorMsg('');
  };

  const callUpdate = () => {
    callError();
  };
  useEffect(() => {
    if (errorMsg === '') {
      updateUser({ variables: _.pickBy(values, (value) => value) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMsg]);
  /* const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (actions.validateForm()) {
      if (confirmEmail !== '') {
        if (confirmEmail !== values.email) {
          return setErrorMsg('email non conform');
        }
      }
      if (confirmPassword !== values.password) {
        return setErrorMsg('mot de pass non conforme');
      }
    } else {
      actions.setAllTouched(true);
    }
    return '';
  }; */
  return (
    <div className={style.accountContainer}>
      <Title title="Mon compte" />
      <div className={style.accountBox}>
        <div className={style.error}>{errorMsg}</div>
        <div className={style.formLogin}>
          <form className={style.twoInputs}>
            <Input
              label="Prénom"
              name="firstName"
              placeholder="Michel"
              onChange={actions.handleChange}
              value={values.firstName}
              containerClassName={style.miniInput}
              required
            />
            <Input
              label="Nom"
              name="lastName"
              onChange={actions.handleChange}
              value={values.lastName}
              placeholder="Niane"
              containerClassName={style.miniInput}
              required
            />
          </form>
          <div className={style.divider} />
          <Input
            label="Email"
            name="email"
            placeholder="exemple@gmail.com"
            onChange={actions.handleChange}
            value={values.email}
            required
          />
          <Input
            label="confirmation email"
            name="confirmEmail"
            placeholder="exemple@gmail.com"
            onChange={onChangeConfirmationEmail}
            value={confirmEmail}
            required
          />
          <div className={style.divider} />
          <Input
            label="ancien mot de passe"
            name="oldPassword"
            onChange={actions.handleChange}
            value={values.oldPassword}
            type="password"
            containerClassName={style.miniInput}
          />
          <div className={style.twoInputs}>
            <Input
              label="nouveau mot de passe"
              name="password"
              onChange={actions.handleChange}
              value={values.password}
              type="password"
              containerClassName={style.miniInput}
            />

            <Input
              label="Confirmation"
              name="confirmPassword"
              onChange={onChangeConfirmationPassword}
              value={confirmPassword}
              type="password"
              containerClassName={style.miniInput}
            />
          </div>
          <p className={style.rules}>
            Utilisez au moins six caractères avec des lettres (minuscule et majuscule), des chiffres et des symboles
          </p>
          <div className={style.divider} />
          <Input
            label="institution"
            name="institution"
            placeholder="Exemple"
            onChange={actions.handleChange}
            value={values.institution}
            required
          />
          <div className={style.divider} />
          <Button
            onClick={() => {
              callUpdate();
            }}
            label="enregistrer les modifications"
          />
        </div>
        <div className={style.conditions}>Conditions d&apos;utilisation | Confidentialité</div>
      </div>
    </div>
  );
};

export default AccountContainer;
