import React, { useContext, useState } from 'react';

import moment from 'moment';
import { useListParcour } from 'common/requests/parcours';

import Crud, { CreateHeaderType } from 'components/ui/Crud/Crud';
import { AdminParcourItem } from 'common/requests/types';
import userContext from 'common/contexts/UserContext';
import ViewParcourIcon from 'assets/svg/Icon DIAGORIENTE.svg';
import { useUpdateUser } from 'common/requests/user';
import classNames from 'common/utils/classNames';
import ParcourFilter from 'components/Filters/ParcourFilter/ParcourFilter';
import { RouteComponentProps } from 'react-router-dom';
import useUpdateUserInfo from 'utils/UpdateUserData';
import Modal from 'components/Modal/Modal';

import ModalSkills from 'components/ModalSkills/ModalSkills';
import classes from './style.module.scss';

const Parcour = ({ history }: RouteComponentProps) => {
  const { user } = useContext(userContext);
  const [updateTutoCall, updateTutoState] = useUpdateUser();
  const [selectedUser, setSelectedUser] = useState('');
  if (user?.isActive && user.tutorialStep === 3) {
    updateTutoCall({ variables: { tutorialStep: 4 } });
  }
  useUpdateUserInfo(updateTutoState.data?.updateUser);

  const createHeaders: CreateHeaderType<AdminParcourItem> = () => {
    return [
      {
        title: '',
        render: (row) => (
          <div className={classes.avatarLogo}>
            <img className={classes.avatar} src={row.userId?.logo} alt="logo" />
          </div>
        ),
        key: 'avatar',
      },
      {
        title: [
          <span key="name" className={classes.nameHeader}>
            PRÉNOM NOM
          </span>,
          <span key="email" className={classes.email}>
            EMAIL
          </span>,
          <span key="createdAt" className={classes.email}>
            DATE DE CRÉATION
          </span>,
        ],
        render: (row) =>
          row.userId && [
            <div key="email" className={classes.name} onClick={() => history.push(`/parcour/${row.userId.id}`)}>
              <span className={classes.firstSpan}>{row.userId.profile.firstName}</span>
              <span>{row.userId.profile.lastName}</span>
            </div>,
            <span key="email" className={classes.email}>
              {row.userId.email}
            </span>,
            <span key="createdAt" className={classes.email}>
              {moment(row.createdAt).format('DD/MM/YYYY')}
            </span>,
          ],
        key: 'name',
      },
      {
        title: 'CONNEXION',
        key: 'CONNEXION',
        render: (row) => {
          const date = row.userId.nbrLogin.length
            ? row.userId.nbrLogin[row.userId.nbrLogin.length - 1].date
            : row.userId.createdAt;
          return moment(date).fromNow();
        },
      },
      {
        title: 'ÉTAT',
        render: (row) =>
          row.completed ? (
            <span className={classNames(classes.status, classes.completed)}>Complété</span>
          ) : (
            <span className={classNames(classes.status, classes.nonCompleted)}>Non complété</span>
          ),
        key: 'completed',
      },
      {
        title: '',
        render: (row) => {
          return (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row.userId.id);
              }}
              className={classes.center}
            >
              <img className={classes.viewIcon} src={ViewParcourIcon} alt="" />
            </div>
          );
        },
        key: 'view',
      },
    ];
  };

  return (
    <>
      <Crud
        handleUri={(uri) => {
          if (uri.completed) {
            return { ...uri, completed: uri.completed === 'true' };
          }
          return uri;
        }}
        Filter={ParcourFilter}
        createHeaders={createHeaders}
        list={useListParcour}
      />
      <Modal close={classes.close} isOpen={Boolean(selectedUser)} onClose={() => setSelectedUser('')}>
        <ModalSkills userId={selectedUser} />
      </Modal>
    </>
  );
};

export default Parcour;
