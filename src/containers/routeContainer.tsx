import React, { useReducer } from 'react';
import { Switch } from 'react-router-dom';
import UserContext from 'common/contexts/UserContext';
import useRoot from 'common/containers/useRoot';
import Route from 'components/ui/Route';
import SnackBarContext, { snackbarState, snackbarReducer, SnackBarActionType } from 'common/contexts/SnackbarContext';
import TutorialContainer from 'containers/tutorialContainer/tutorialContainer';
import HomeContainer from 'containers/homeContainer/homeContainer';
import LivretActiviteContainer from 'containers/livretActivite/livretActivite';
import LoginContainer from 'containers/loginContainer';
import detailProfilContainer from 'containers/detailProfilContainer/detailProfilContainer';
import RegisterContainer from 'containers/registerContainer';
import ForgotPasswordContainer from 'containers/ForgotPasswordContainer/ForgotPasswordContainer';
import RenewPasswordContainer from 'containers/RenewPasswordContainer/RenewPasswordContainer';
import FormationContainer from 'containers/formationContainer/formationContainer';
import AccountContainer from 'containers/accountContainer/accountContainer';
import ConfirmationAdvisor from 'containers/confirmationAdvisor/';
import groupesContainer from 'containers/groupeContainer/groupesContainer';

import ParcourContainer from 'containers/parcourContainer/Parcour';
import SnackBar from 'components/ui/SnackBar/SnackBar';
import ReferenceContainer from './referenceContainer/Reference';
import AddReferenceContainer from './addReferenceContainer/AddReference';

const RootContainer = () => {
  const { startupEnd, user, setUser } = useRoot();
  const [state, dispatch] = useReducer(snackbarReducer, snackbarState);
  if (!startupEnd) return <div />;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SnackBarContext.Provider value={{ state, dispatch }}>
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <Route protected footer path="/tutorial" exact component={TutorialContainer} />
          <Route footer path="/login" exact component={LoginContainer} />
          <Route footer path="/register" exact component={RegisterContainer} />
          <Route footer path="/forgotPassword" exact component={ForgotPasswordContainer} />

          <Route protected footer path="/formation" exact component={FormationContainer} />
          <Route protected footer path="/Ressources" exact component={LivretActiviteContainer} />
          <Route protected footer path="/parcour/:id" exact component={detailProfilContainer} />
          <Route protected footer path="/parcours" exact component={ParcourContainer} />
          <Route protected footer path="/groupes" component={groupesContainer} />
          <Route protected footer path="/detail-profil" exact component={detailProfilContainer} />
          <Route protected footer path="/account" exact component={AccountContainer} />
          <Route footer path="/forgotPassword" exact component={ForgotPasswordContainer} />
          <Route footer path="/reset" exact component={RenewPasswordContainer} />
          <Route protected path="/references" exact component={ReferenceContainer} />
          <Route protected path="/reference/add" exact component={AddReferenceContainer} />
          <Route path="/confirmationAdvisor" component={ConfirmationAdvisor} />
        </Switch>
        <SnackBar
          message={state.message}
          variant={state.variant}
          open={state.open}
          onClose={() => dispatch({ type: SnackBarActionType.close })}
        />
      </SnackBarContext.Provider>
    </UserContext.Provider>
  );
};

export default RootContainer;
