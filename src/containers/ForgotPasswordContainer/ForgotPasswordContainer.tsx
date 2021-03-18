import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { useDidMount } from 'common/hooks/useLifeCycle';

import Input from 'components/Form/Input/Input';
import useForgotPassword from 'common/containers/useForgotPassword';
import Button from 'components/Button/Button';

import Logo from '../../assets/svg/diagoriente_logo.svg';
import style from './style.module.scss';

const ForgotPassword = () => {
  const { forgotState, onSubmit, state, actions } = useForgotPassword();
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  useDidMount(() => {
    window.scrollTo({ top: 0, left: 0 });
  });
  useEffect(() => {
    if (forgotState.error?.graphQLErrors.length !== 0) {
      if (
        forgotState.error?.graphQLErrors[0].message &&
        typeof forgotState.error?.graphQLErrors[0].message === 'object'
      ) {
        setError((forgotState.error?.graphQLErrors[0].message as any).message);
      } else if (
        forgotState.error?.graphQLErrors[0].message &&
        typeof forgotState.error?.graphQLErrors[0].message === 'string'
      ) {
        setErrorCount(errorCount + 1);

        setError(forgotState.error?.graphQLErrors[0].message);
      }
    }
    if (forgotState.error?.message && forgotState.error?.graphQLErrors.length === 0) {
      setError(forgotState.error?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotState.error]);
  useEffect(() => {
    if (forgotState.data) {
      setError('');
      setOpen(true);
    }
  }, [forgotState.data]);
  const callError = () => {
    if (state.errors.email !== '') setError(state.errors.email);
    else setError('');
  };

  return (
    <div className={style.container}>
      <a href="https://diagoriente.beta.gouv.fr/" className={style.logoContainer}>
        <div>
          <img src={Logo} alt="logo" />
        </div>
      </a>
      <div className={style.boxLogin}>
        {!open ? (
          <div className={style.content}>
            <div className={style.title}>Mot de passe oublié</div>
            <div className={style.error}>{error}</div>

            <div className={style.linkLabel}>Entrez votre email</div>
            <form className={style.formLogin} onSubmit={onSubmit}>
              <Input
                label="votre email"
                name="email"
                placeholder="exemple@gmail.com"
                onChange={actions.handleChange}
                value={state.values.email}
              />

              <Button
                label="envoyer"
                onClick={() => {
                  callError();
                }}
              />
            </form>
          </div>
        ) : (
          <div className={style.content}>
            <div className={style.title}>Vérifiez votre email</div>

            <div>
              <p className={style.text_confirmation}>
                {`Nous avons envoyé un lien de récupération de `}
                <br />
                {`votre compte à l'adresse `}
                <b>{state.values.email}</b>
              </p>
            </div>
            <form className={style.formLogin}>
              <Link to="/login">
                <Button label="retour accueil" />
              </Link>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
