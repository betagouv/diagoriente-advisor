import React, { useEffect, useRef, useState, useContext } from 'react';
import moment from 'moment';
import Title from 'components/Title/Title';
import Crud, { ApisRef, CreateHeaderType } from 'components/ui/Crud/Crud';
import { Group } from 'common/requests/types';
import { useCreateGroup, useGroups } from 'common/requests/groupes';
import { useLocation } from 'react-router-dom';
import Modal from 'components/Modal/Modal';
import userContext from 'common/contexts/UserContext';
import { useUpdateUser } from 'common/requests/user';
import useUpdateUserInfo from 'utils/UpdateUserData';
import EmptyGroup from './components/EmptyGroup/EmptyGroup';
import AddGroup from './components/AddGroup/AddGroup';
import GroupForm from './components/GroupForm/GroupForm';
import CopyButton from './components/CopyButton/CopyButton';
import InviteButton from './components/InviteButton/InviteButton';
import InviteUser from './components/InviteUser/InviteUser';

import style from './style.module.scss';

const groupesContainer = () => {
  const location = useLocation();
  const { user } = useContext(userContext);
  const [updateTutoCall, updateTutoState] = useUpdateUser();
  const crudRef = useRef<ApisRef<Group, any>>(null);
  const [lastCreatedId, setLastCreatedId] = useState(null as string | null);
  const [selectedGroup, setSelectedGroup] = useState(null as Group | null);

  useEffect(() => {
    if (location.pathname === '/groupes' && crudRef.current?.createState?.data) {
      crudRef.current.list.refetch();
      setLastCreatedId(crudRef.current.createState.data.createGroup.id);
      if (user?.isActive && user.tutorialStep === 1) {
        updateTutoCall({ variables: { tutorialStep: 2 } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  useUpdateUserInfo(updateTutoState.data?.updateUser);

  const onInviteClose = () => {
    setSelectedGroup(null);
  };

  const createHeaders: CreateHeaderType<Group> = () => {
    return [
      {
        title: (
          <>
            nom du groupe
            <span className={style.headerText}>membres</span>
            <span className={style.headerText}>création</span>
          </>
        ),
        render: (row) => (
          <>
            <span className={style.groupTitle}>{row.title}</span>
            <span className={style.groupDetail}>{`${row.users.length} membres`}</span>
            <span className={style.groupDetail}>{`créé le ${moment(row.createdAt).format('DD/MM/YYYY')}`}</span>
          </>
        ),
        key: 'name',
      },
      {
        title: (
          <div className={style.addContainer}>
            <AddGroup />
          </div>
        ),
        render: (row) => (
          <div className={style.actions}>
            <span className={style.code}>
              <span className={style.codeLabel}>CODE : </span>
              {row.code}
            </span>
            <CopyButton code={row.code} />
            <InviteButton onClick={() => setSelectedGroup(row)} />
          </div>
        ),
        key: 'actions',
      },
    ];
  };

  return (
    <>
      <Title title="Groupes" />
      <Crud
        apisRef={crudRef}
        Form={GroupForm}
        createHeaders={createHeaders}
        list={useGroups}
        create={useCreateGroup}
        modalProps={{ className: style.modal, body: style.modalBody }}
        noPages
        className={style.crud}
        autoRedirect={false}
        formProps={{ lastCreatedId, onInvite: (group) => setSelectedGroup(group) }}
        tableProps={{
          EmptyComponent: EmptyGroup,
          classes: { container: style.table, row: style.tableRow, head: style.tableRow },
        }}
      />
      <Modal className={style.modal} body={style.modalBody} onClose={onInviteClose} isOpen={Boolean(selectedGroup)}>
        {selectedGroup ? <InviteUser onRequestClose={onInviteClose} group={selectedGroup} /> : <div />}
      </Modal>
    </>
  );
};

export default groupesContainer;
