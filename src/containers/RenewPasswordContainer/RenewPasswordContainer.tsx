import React, { useState, useEffect } from 'react';

import { useDidMount } from 'common/hooks/useLifeCycle';
import { RouteComponentProps, Redirect } from 'react-router-dom';

import Input from 'components/Form/Input/Input';
import useRenewPassword from 'common/containers/useRenewPassword';
import Button from 'components/Button/Button';

import Logo from '../../assets/svg/diagoriente_logo.svg';
import style from './style.module.scss';

const RenewPasswordContainer = ({ location }: RouteComponentProps) => {
  const { state, actions, errorForm, resetStateAdvisor, onSubmit } = useRenewPassword(location);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const onShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  useDidMount(() => {
    window.scrollTo({ top: 0, left: 0 });
  });
  useEffect(() => {
    if (resetStateAdvisor.error?.graphQLErrors.length !== 0) {
      if (
        resetStateAdvisor.error?.graphQLErrors[0].message &&
        typeof resetStateAdvisor.error?.graphQLErrors[0].message === 'object'
      ) {
        setError((resetStateAdvisor.error?.graphQLErrors[0].message as any).message);
      } else if (
        resetStateAdvisor.error?.graphQLErrors[0].message &&
        typeof resetStateAdvisor.error?.graphQLErrors[0].message === 'string'
      ) {
        setErrorCount(errorCount + 1);

        setError(resetStateAdvisor.error?.graphQLErrors[0].message);
      }
    }
    if (resetStateAdvisor.error?.message && resetStateAdvisor.error?.graphQLErrors.length === 0) {
      setError(resetStateAdvisor.error?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetStateAdvisor.error]);
  const callError = () => {
    if (state.errors.password !== '') setError(state.errors.password);
  };

  if (resetStateAdvisor.data && !resetStateAdvisor.error) {
    return <Redirect to="/login" />;
  }
  return (
    <div className={style.container}>
      <a href="https://diagoriente.beta.gouv.fr/" className={style.logoContainer}>
        <div>
          <img src={Logo} alt="logo" />
        </div>
      </a>
      <div className={style.boxLogin}>
        <div className={style.content}>
          <div className={style.title}>Mot de passe oublié</div>
          <div className={style.errorContainer}>
            <p className={style.error}>{error || errorForm}</p>
          </div>

          <div className={style.linkLabel}>Entre ton nouveau mot de passe</div>
          <form className={style.formLogin} onSubmit={onSubmit}>
            <Input
              label="nouveau mot de passe"
              name="password"
              onChange={actions.handleChange}
              showPassword={() => onShowPassword()}
              value={state.values.password}
              type={!showPassword ? 'password' : 'text'}
              containerClassName={style.miniInput}
            />
            <Input
              label="Confirmation"
              name="confirmPassword"
              onChange={actions.handleChange}
              value={state.values.confirmPassword}
              showPassword={() => onShowConfirmPassword()}
              type={!showConfirmPassword ? 'password' : 'text'}
              containerClassName={style.miniInput}
            />
            <Button
              label="Confirmer"
              onClick={() => {
                callError();
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
export default RenewPasswordContainer;
