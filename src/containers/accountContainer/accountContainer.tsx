import React, { useContext, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      oldPassword: validatePassword,
      institution: isStringEmpty,
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
  const { values, errors } = state;
  useUpdateUserInfo(updateUserState.data?.updateUser);
  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const onShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const onShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const callUpdate = () => {
    const error = Object.values(errors).filter((e) => e !== '')[0];
    if (
      confirmEmail === '' &&
      values.email === '' &&
      values.lastName === '' &&
      values.firstName === '' &&
      values.password === '' &&
      confirmPassword === '' &&
      values.institution === ''
    ) {
      return setErrorMsg('tous les champs vide');
    }
    if (confirmEmail !== '') {
      if (confirmEmail !== values.email) {
        return setErrorMsg('Email et confirmation Email ne correspondent pas');
      }
    }
    if (confirmPassword !== values.password) {
      return setErrorMsg('Mot de passe et confirmation mot de passe ne correspondent pas');
    }
    if (values.oldPassword !== '' && values.password !== '') {
      if (values.oldPassword === values.password) {
        return setErrorMsg("Le nouveau mot de passe et l'ancien ne peuvent pas ??tre identiques");
      }
    }
    if (error) {
      return setErrorMsg(error);
    }
    updateUser({ variables: _.pickBy(values, (value) => value) });
    return setErrorMsg('Vos modifications ont bien ??t?? enregistr??es');
  };

  return (
    <div className={style.accountContainer}>
      <Title title="Mon compte" />
      <div className={style.accountBox}>
        <div className={style.error}>{errorMsg}</div>
        <div className={style.formLogin}>
          <form className={style.twoInputs}>
            <Input
              label="Pr??nom"
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
            showPassword={() => onShowOldPassword()}
            type={!showOldPassword ? 'password' : 'text'}
            containerClassName={style.miniInput}
          />
          <div className={style.twoInputs}>
            <Input
              label="nouveau mot de passe"
              name="password"
              onChange={actions.handleChange}
              showPassword={() => onShowPassword()}
              value={values.password}
              type={!showPassword ? 'password' : 'text'}
              containerClassName={style.miniInput}
            />

            <Input
              label="Confirmation"
              name="confirmPassword"
              onChange={onChangeConfirmationPassword}
              value={confirmPassword}
              showPassword={() => onShowConfirmPassword()}
              type={!showConfirmPassword ? 'password' : 'text'}
              containerClassName={style.miniInput}
            />
          </div>
          <p className={style.rules}>
            Utilisez au moins six caract??res avec des lettres (minuscule et majuscule), des chiffres et des symboles
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
        <div className={style.conditions}>Conditions d&apos;utilisation | Confidentialit??</div>
      </div>
    </div>
  );
};

export default AccountContainer;
