import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Theme } from 'common/requests/types';
import { useThemesAdvisor, useAddThemeAdvisor, useLazyThemesAdvisor } from 'common/requests/themes';
import { useReferences } from 'common/requests/reference';
import { useDidMount } from 'common/hooks/useLifeCycle';
import { useLazyGroups } from 'common/requests/groupes';
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
import Tooltip from 'rc-tooltip';
import ExperienceFilter from '../../components/Filters/ExperiencesFilter/ExperienceFilter';
import 'rc-tooltip/assets/bootstrap_white.css';
import classes from './experinces.module.scss';
import EmptyComponents from './components/EmptyComponents';

const Experiences = ({ history }: RouteComponentProps) => {
  const crudRef = useRef<ApisRef<Theme, any>>(null);

  const [open, setOpen] = useState(false);
  const [openGroupe, setOpenGroupe] = useState(false);
  const [openRef, setOpenRef] = useState(false);

  const [currentSteps, setCurrentSteps] = useState(0);
  const [heightModal, setHeightModal] = useState('40%');
  const [fields, setFields] = useState([{ value: '' }]);
  const [fieldsGroupes, setFieldsGroupes] = useState([{ value: '', title: '' }]);

  const [groupeSelect, setSelected] = useState<number>(-1);

  const [refSelect, setRefSelect] = useState('');
  const [refSelectName, setRefSelectName] = useState('');

  const [GroupsLocal, setGroupsLocal] = useState<
    {
      id: string;
      code: string;
      title: string;
    }[]
  >([]);

  const [refereneceCall, referenceState] = useReferences();
  const [getGroups, groupsState] = useLazyGroups();
  const [addThemeAdvisor, addThemeAdvisorState] = useAddThemeAdvisor();
  const [listThemesAdvisor] = useLazyThemesAdvisor({ fetchPolicy: 'network-only' });

  const [state, actions] = useForm({ initialValues: { title: '', activities: [] }, required: ['title'] });
  const { values } = state;
  const { handleChange } = actions;
  const [errorMsg, setErrorMsg] = useState('');
  useDidMount(() => {
    refereneceCall();
    getGroups();
  });
  useEffect(() => {
    if (groupsState.data) {
      setGroupsLocal(groupsState.data?.groupes.data);
    }
  }, [groupsState.data]);

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
    if (fields.length < 1) {
      setErrorMsg('activités obligatoire');
    } else {
      setCurrentSteps(2);
      setHeightModal('70%');
      setErrorMsg('');
    }
  };
  const handleLastSubmit = () => {
    const acts: string[] = fields.map((a) => a.value);
    const dataToSend: { theme: string; activities: string[]; groups: string[]; reference?: string } = {
      theme: values.title,
      activities: acts,
      groups: fieldsGroupes.map((g) => g.value),
    };
    if (refSelect) {
      dataToSend.reference = refSelect;
    }
    addThemeAdvisor({ variables: { ...dataToSend } });
  };

  const restFields = () => {
    actions.setValues({ title: '', activities: [] });
    setFields([{ value: '' }]);
    setFieldsGroupes([{ value: '', title: '' }]);
    setErrorMsg('');
  };
  const handleAdd = () => {
    const value = [...fields];
    value.push({ value: '' });
    setFields(value);
  };
  const handleAddGroupe = () => {
    const value = [...fieldsGroupes];
    value.push({ value: '', title: '' });
    setFieldsGroupes(value);
  };
  const handleChangeFields = (i: any, event: any) => {
    const value = [...fields];
    value[i].value = event.target.value;
    setFields(value);
  };
  const handleChangeFieldsGroupes = (i: any, data: { value: string; title: string }) => {
    const value = [...fieldsGroupes];
    value[i] = data;
    setFieldsGroupes(value);
  };

  const createHeaders: CreateHeaderType<Theme> = () => {
    return [
      {
        title: (
          <div style={{ flex: 1 }}>
            EXPÉRIENCE
            <span className={classes.headerText}>ACTIVITÉS</span>
          </div>
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
        render: (row) => (
          <div className={classes.actions}>
            <div className={classes.btnActon} onClick={() => history.push(`/references?id=${row.reference?.id}`)}>
              <div className={classes.wrapperBtn}>
                <RefLogo color="#10255e" />
                <div className={classes.selectedOption}>{row.reference?.title}</div>
              </div>
            </div>
            {row.groups && row.groups.length === 1 ? (
              <div
                className={classes.btnActon}
                onClick={() => history.push(`/parcours?code=${row.groups && row.groups[0].code}`)}
              >
                <div className={classes.wrapperBtn}>
                  <GroupeLogo color="#10255e" />
                  <div className={classes.selectedOption}>{row.groups && row.groups[0].title}</div>
                </div>
              </div>
            ) : (
              <Tooltip
                overlayClassName={classes.tooltip}
                placement="top"
                overlay={() => (
                  <ul>
                    {row.groups?.map((g) => (
                      <li onClick={() => history.push(`/parcours?code=${g.code}`)}>{g.title}</li>
                    ))}
                  </ul>
                )}
                overlayStyle={{ borderRadius: '10px', border: 'none' }}
                overlayInnerStyle={{
                  backgroundColor: '#10255e',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '10',
                  cursor: 'pointer',
                }}
                arrowContent={<div className="rc-tooltip-arrow-inner" />}
              >
                <div className={classes.btnActon}>
                  <div className={classes.wrapperBtn}>
                    <GroupeLogo color="#10255e" />
                    <div className={classes.selectedOption}>
                      {row.groups && row.groups.length > 1
                        ? `${row.groups.length} Groupes`
                        : row.groups && row.groups[0].title}
                    </div>
                  </div>
                </div>
              </Tooltip>
            )}
          </div>
        ),
        key: 'actions',
      },
    ];
  };
  useEffect(() => {
    if (addThemeAdvisorState.data) {
      setOpen(false);
      setOpenGroupe(false);
      setOpenRef(false);
      setSelected(-1);
      restFields();
      listThemesAdvisor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addThemeAdvisorState.data]);

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
      <form className={classes.inputGroupeStyle}>
        <span className={classes.labelSelect}>référentiel</span>
        <div className={classes.btnShowRefs} onClick={() => setOpenRef(!openRef)}>
          <span className={classes.selectedOption}>
            {referenceState.data?.references.data.length !== 0 ? refSelectName : 'défaut'}
          </span>
          {referenceState.data?.references.data.length !== 0 && (
            <img src={ArrowLeft} alt="arrow" className={classes.img} />
          )}
          {openRef && referenceState.data?.references.data.length !== 0 && (
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
        {fieldsGroupes.map((field, idx) => (
          <div key={`${field}-${idx * 2}`}>
            <span className={classes.labelSelect}>{`groupe ${idx + 1}`}</span>
            <div
              className={classes.btnShowRefs}
              onClick={() => {
                setOpenGroupe(!openGroupe);
                setSelected(idx);
              }}
            >
              <span className={classes.selectedOption}>{fieldsGroupes[idx].title}</span>
              <img src={ArrowLeft} alt="arrow" className={classes.img} />
              {openGroupe && groupeSelect === idx && (
                <div className={classes.optionsContainer}>
                  {GroupsLocal?.map((e) => (
                    <p
                      className={classNames(classes.option)}
                      onClick={() => {
                        handleChangeFieldsGroupes(idx, { title: e.title, value: e.id });
                      }}
                    >
                      {e.title}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {GroupsLocal.length !== 0 && (
          <div onClick={handleAddGroupe} className={classes.outlineAddBtn}>
            <Plus width="20" height="20" color="#10255E" strokeWidth="1" />
            <span className={classes.LabelAddAct}>ajouter groupe à qui partager</span>
          </div>
        )}
        <Button type="button" label="valider" className={classes.validerButton} onClick={handleLastSubmit} />
      </form>
      <span className={classes.aide}>Besion d&apos;aide ?</span>
    </>,
  ];
  return (
    <div className={classes.experienceContainer}>
      <div className={classNames(classes.add)} onClick={() => setOpen(true)}>
        <img className={classes.icon} src={AddIcon} alt="" />
        ajouter une expérience
      </div>
      <Crud
        apisRef={crudRef}
        createHeaders={createHeaders}
        Filter={ExperienceFilter}
        list={useThemesAdvisor}
        modalProps={{ className: classes.modal, body: classes.modalBody }}
        className={classes.crud}
        autoRedirect={false}
        tableProps={{
          EmptyComponent: EmptyComponents,
          classes: { container: classes.table, row: classes.tableRow, head: classes.tableRow },
        }}
      />
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
