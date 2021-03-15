import useLogin from 'common/containers/useLogin';
import React, { useState } from 'react';

import { Redirect, RouteComponentProps, Link } from 'react-router-dom';
import { decodeUri } from 'common/utils/url';
import { useDidMount } from 'common/hooks/useLifeCycle';
import Input from 'components/Form/Input/Input';
import Button from 'components/Button/Button';
import Checkbox from 'components/Checkbox/Checkbox';
import Logo from '../../assets/svg/diagoriente_logo.svg';
import style from './style.module.scss';

const LoginContainer = ({ location }: RouteComponentProps) => {
  const { user, errorForm, onSubmit, state, actions } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };
  useDidMount(() => {
    window.scrollTo({ top: 0, left: 0 });
  });

  if (user) {
    const { from } = decodeUri(location.search);
    return <Redirect to={from || '/'} />;
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
          <div className={style.title}>Connexion</div>
          <Link to="/register" className={style.link}>
            <div className={style.linkLabel}>vous n’avez pas de compte ?</div>
          </Link>
          <div className={style.error}>{errorForm}</div>
          <form className={style.formLogin} onSubmit={onSubmit}>
            <Input
              label="Email"
              name="email"
              placeholder="exemple@gmail.com"
              onChange={actions.handleChange}
              value={state.values.email}
              required
            />
            <Input
              label="Mot de passe"
              name="password"
              onChange={actions.handleChange}
              value={state.values.password}
              placeholder="Mot de passe"
              showPassword={() => onShowPassword()}
              type={!showPassword ? 'password' : 'text'}
              required
            />
            <Checkbox
              text="Se souvenir de moi"
              onChange={actions.handleChange}
              checked={state.values.stayConnected}
              name="stayConnected"
            />
            <Button label="se connecter" />
          </form>
          <Link to="/forgotPassword" className={style.link}>
            <div className={style.linkLabel}>mot de passe oublié ?</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
