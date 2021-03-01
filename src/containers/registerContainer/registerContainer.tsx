import React, { useEffect, useState } from 'react';
import ModalContainer from 'components/Modal/Modal';
import { Link } from 'react-router-dom';
import useRegisterAdvisor from 'common/containers/useRegisterAdmin';
import { useDidMount } from 'common/hooks/useLifeCycle';
import Title from 'components/Title/Title';

import Input from 'components/Form/Input/Input';
import Button from 'components/Button/Button';
import Logo from '../../assets/svg/diagoriente_logo.svg';
import style from './style.module.scss';

const RegisterContainer = () => {
  const {
    errorForm,
    errorFormObject,
    onSubmit,
    values,
    actions,
    registerState,
    confirmationPassword,
    onChangeConfirmationPassword,
    confirmationEmail,
    onChangeConfirmationEmail,
  } = useRegisterAdvisor();
  useDidMount(() => {
    window.scrollTo({ top: 0, left: 0 });
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (registerState.data) {
      setOpen(true);
    }
  }, [registerState.data]);
  return (
    <div className={style.container}>
      <div className={style.logoContainer}>
        <img src={Logo} alt="logo" />
      </div>
      <div className={style.boxRegister}>
        <div className={style.content}>
          <div className={style.title}>Création de compte</div>
          <Link to="/login" className={style.link}>
            <div className={style.linkLabel}>vous avez déjà un compte ?</div>
          </Link>
          <div className={style.error}>{errorForm || errorFormObject.value}</div>
          <form className={style.formLogin} onSubmit={onSubmit}>
            <div className={style.twoInputs}>
              <Input
                label="Prénom"
                name="firstName"
                placeholder="Prénom"
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
                placeholder="Nom"
                containerClassName={style.miniInput}
                required
              />
            </div>
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
              value={confirmationEmail}
              required
            />
            <div className={style.twoInputs}>
              <Input
                label="Mot de passe"
                name="password"
                onChange={actions.handleChange}
                value={values.password}
                placeholder="Mot de passe"
                type="password"
                containerClassName={style.miniInput}
                required
              />

              <Input
                label="Confirmation"
                name="confirmPassword"
                onChange={onChangeConfirmationPassword}
                value={confirmationPassword}
                placeholder="Confirmation"
                type="password"
                containerClassName={style.miniInput}
                required
              />
            </div>
            <p className={style.rules}>
              Utilisez au moins six caractères avec des lettres, des chiffres et des symboles
            </p>
            <Input
              label="institution"
              name="institution"
              placeholder="Exemple"
              onChange={actions.handleChange}
              value={values.institution}
              required
            />

            <Button label="créer" />
          </form>
          <div className={style.conditions}>Conditions d&apos;utilisation | Confidentialité</div>
        </div>
      </div>
      <ModalContainer isOpen={open} onClose={() => setOpen(false)} className={style.modal_confirmation}>
        <>
          <div className={style.titleModal}>
            <Title title="Activez votre compte" />
          </div>
          <div className={style.modalBody}>
            <p className={style.text_confirmation}>
              {`Votre compte a bien été créé, activez-le en cliquant sur le lien que nous vous avons envoyé à: `}
              <b>{values.email}</b>
            </p>
            <div className={style.btn_container}>
              <Link to="/">
                <Button label="J’AI COMPRIS" outlined onClick={() => setOpen(false)} className={style.btn_style} />
              </Link>
            </div>
          </div>
        </>
      </ModalContainer>
    </div>
  );
};

export default RegisterContainer;
