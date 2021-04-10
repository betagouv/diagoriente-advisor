import React, { useState, FormEvent, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Theme } from 'common/requests/types';
import { useThemes } from 'common/requests/themes';
import { useReferences } from 'common/requests/reference';
import { useDidMount } from 'common/hooks/useLifeCycle';
import { useLazyGroups } from 'common/requests/groupes';

import Title from 'components/Title/Title';
import classNames from 'common/utils/classNames';
import { useForm } from 'common/hooks/useInputs';
import useOnclickOutside from 'common/hooks/useOnclickOutside';
import ModalContainer from 'components/Modal/Modal';
import Input from 'components/Form/Input/Input';
import Button from 'components/Button/Button';
import Crud, { ApisRef, CreateHeaderType } from 'components/ui/Crud/Crud';
import Plus from 'assets/svg/addCustom';
import AddIcon from 'assets/svg/Icon ADD.svg';
import ArrowLeft from 'assets/svg/arrow-left.svg';
import RefLogo from 'assets/svg/drawer/DrawerReferentiel';
import GroupeLogo from 'assets/svg/drawer/DrawerGroupes';

import classes from './experinces.module.scss';
import EmptyComponents from './components/EmptyComponents';

const Experiences = ({ history }: RouteComponentProps) => {
  const crudRef = useRef<ApisRef<Theme, any>>(null);

  const [open, setOpen] = useState(false);
  const [openGroupe, setOpenGroupe] = useState(false);
  const [openRef, setOpenRef] = useState(false);

  const [currentSteps, setCurrentSteps] = useState(0);
  const [heightModal, setHeightModal] = useState('40%');
  const [fields, setFields] = useState([{ value: undefined }]);
  const [groupeSelect, setGroupeSelect] = useState('');
  const [groupeSelectName, setGroupSelectName] = useState('');

  const [refSelect, setRefSelect] = useState('');
  const [refSelectName, setRefSelectName] = useState('');

  const [refereneceCall, referenceState] = useReferences();
  const [getGroups, groupsState] = useLazyGroups();

  const [state, actions] = useForm({ initialValues: { title: '', activities: [] }, required: ['title'] });
  const { values } = state;
  const { handleChange } = actions;
  const [errorMsg, setErrorMsg] = useState('');
  useDidMount(() => {
    refereneceCall();
    getGroups();
  });

  const divRef = useRef<HTMLDivElement>(null);
  useOnclickOutside(divRef, () => setOpenGroupe(false));
  const divGroupe = useRef<HTMLDivElement>(null);
  useOnclickOutside(divGroupe, () => setOpenRef(false));
  const handleFirstSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.title.length < 3) {
      setErrorMsg('Le nom du expérience doit contenir au moins 3 lettres');
    } else {
      setCurrentSteps(1);
      setHeightModal('70%');
      setErrorMsg('');
    }
  };
  const handleSecondSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('fields', fields);
    if (fields.length < 1) {
      setErrorMsg('activités obligatoire');
    } else {
      setCurrentSteps(2);
      setHeightModal('70%');
      setErrorMsg('');
    }
  };
  const handleLastSubmit = () => {
    const dataToSend = {
      title: values.title,
      activities: values.activities,
      idRef: refSelect,
      idGroupe: groupeSelect,
    };
    console.log('dataToSend', dataToSend);
  };
  const restFields = () => {
    actions.setValues({ title: '', activities: [] });
    setFields([{ value: undefined }]);
    setErrorMsg('');
  };
  const handleAdd = () => {
    const value = [...fields];
    value.push({ value: undefined });
    setFields(value);
  };
  const handleChangeFields = (i: any, event: any) => {
    const value = [...fields];
    value[i].value = event.target.value;
    setFields(value);
  };

  const createHeaders: CreateHeaderType<Theme> = () => {
    return [
      {
        title: (
          <>
            EXPÉRIENCE
            <span className={classes.headerText}>ACTIVITÉS</span>
          </>
        ),
        render: (row) => (
          <>
            <span className={classes.groupTitle}>{row.title}</span>
            <span className={classes.headerText}>{row.activities.slice(0, 3).map((act) => `${act.title}, `)}</span>
          </>
        ),
        key: 'name',
      },
      {
        title: <div className={classes.addContainer} />,
        render: () => (
          <div className={classes.actions}>
            <div className={classes.btnActon} onClick={() => history.push('/references?id=606c8566202773684150912f')}>
              <div className={classes.wrapperBtn}>
                <RefLogo color="#10255e" />
                <div className={classes.selectedOption}>refName</div>
              </div>
            </div>
            <div className={classes.btnActon}>
              <div className={classes.wrapperBtn}>
                <GroupeLogo color="#10255e" />
                <div className={classes.selectedOption}>groupeName</div>
              </div>
            </div>
          </div>
        ),
        key: 'actions',
      },
    ];
  };

  const steps = [
    <>
      <h1 className={classes.title}>Ajouter une Expérience</h1>
      <div className={classes.error}>{errorMsg}</div>
      <form onSubmit={handleFirstSubmit} className={classes.inputGroupeStyle}>
        <Input
          value={values.title}
          onChange={handleChange}
          label="Nom de l’expérience"
          name="title"
          war={classes.war}
          containerClassName={classes.input}
          required
        />
        <Button label="valider" className={classes.validerButton} />
      </form>
      <span className={classes.aide}>Besion d&apos;aide ?</span>
    </>,
    <>
      <h1 className={classes.title}>Ajoutez des activités à votre expérience</h1>
      <div className={classes.error}>{errorMsg}</div>
      <form onSubmit={handleSecondSubmit} className={classes.inputGroupeStyle}>
        {fields.map((field, idx) => {
          return (
            <div key={`${field}-${idx * 2}`}>
              <Input
                value={field.value}
                onChange={(e) => handleChangeFields(idx, e)}
                label={`Activité ${idx + 1}`}
                name="title"
                war={classes.war}
                containerClassName={classes.input}
                required
              />
            </div>
          );
        })}
        <div onClick={handleAdd} className={classes.outlineAddBtn}>
          <Plus width="20" height="20" color="#10255E" strokeWidth="1" />
          <span className={classes.LabelAddAct}>ajouter activité</span>
        </div>
        <Button label="valider" className={classes.validerButton} />
      </form>
      <span className={classes.aide}>Besion d&apos;aide ?</span>
    </>,
    <>
      <h1 className={classes.title}>Ajoutez un référentiel et partagez à un groupe</h1>
      <div className={classes.error}>{errorMsg}</div>
      <form onSubmit={handleLastSubmit} className={classes.inputGroupeStyle}>
        <span className={classes.labelSelect}>référentiel</span>
        <div className={classes.btnShowRefs} onClick={() => setOpenRef(!openRef)}>
          <span className={classes.selectedOption}>{refSelectName}</span>
          <img src={ArrowLeft} alt="arrow" className={classes.img} />
          {openRef && (
            <div className={classes.optionsContainer}>
              {referenceState.data?.references.data.map((r) => (
                <p
                  className={classes.option}
                  onClick={() => {
                    setRefSelect(r.id);
                    setRefSelectName(r.title);
                  }}
                >
                  {r.title}
                </p>
              ))}
            </div>
          )}
        </div>
        <span className={classes.labelSelect}>groupe</span>
        <div className={classes.btnShowRefs} onClick={() => setOpenGroupe(!openGroupe)}>
          <span className={classes.selectedOption}>{groupeSelectName}</span>
          <img src={ArrowLeft} alt="arrow" className={classes.img} />
          {openGroupe && (
            <div className={classes.optionsContainer}>
              {groupsState.data?.groupes.data.map((e) => (
                <p
                  className={classes.option}
                  onClick={() => {
                    setGroupeSelect(e.title);
                    setGroupSelectName(e.title);
                  }}
                >
                  {e.title}
                </p>
              ))}
            </div>
          )}
        </div>
        <Button label="valider" className={classes.validerButton} />
      </form>
      <span className={classes.aide}>Besion d&apos;aide ?</span>
    </>,
  ];
  return (
    <div className={classes.experienceContainer}>
      <Title title="Mes expériences" className={classes.titlePage} />
      <div className={classes.bodyExperiences}>
        <div className={classNames(classes.add)} onClick={() => setOpen(true)}>
          <img className={classes.icon} src={AddIcon} alt="" />
          ajouter une expérience
        </div>
        <div className={classes.content}>
          <div className={classes.info}>
            <Crud
              apisRef={crudRef}
              createHeaders={createHeaders}
              list={useThemes}
              modalProps={{ className: classes.modal, body: classes.modalBody }}
              className={classes.crud}
              autoRedirect={false}
              /* formProps={{ lastCreatedId, onInvite: (group) => setSelectedGroup(group) }} */
              tableProps={{
                EmptyComponent: EmptyComponents,
                classes: { container: classes.table, row: classes.tableRow, head: classes.tableRow },
              }}
            />
          </div>
        </div>
      </div>
      <ModalContainer
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setCurrentSteps(0);
          restFields();
        }}
        className={classes.modal_confirmation}
        widthSize="50%"
        heightSize={heightModal}
      >
        <div className={classes.bodyModalContent}>{steps[currentSteps]}</div>
      </ModalContainer>
    </div>
  );
};

export default Experiences;
