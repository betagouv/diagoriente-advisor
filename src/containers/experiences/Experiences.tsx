import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Theme, Reference } from 'common/requests/types';
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
  const [refSelected, setRefSelected] = useState<Reference | null>(null);
  const [maxLevel, setMaxLevel] = useState<number>(4);
  const [allowedLevels, setAllowedLevels] = useState<number[]>([]);
  const [levelFirstSelected, setFirstLevel] = useState<number>(0);
  // const [levelLastSelected, setLastLevel] = useState<number>(0);

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
      setErrorMsg('Le nom du exp??rience doit contenir au moins 3 lettres');
    } else {
      setCurrentSteps(1);
      setHeightModal('70%');
      setErrorMsg('');
    }
  };
  const handleSecondSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fields.length < 1) {
      setErrorMsg('activit??s obligatoire');
    } else {
      setCurrentSteps(2);
      setHeightModal('70%');
      setErrorMsg('');
    }
  };
  const handleLastSubmit = () => {
    const acts: string[] = fields.map((a) => a.value);
    const dataToSend: {
      theme: string;
      activities: string[];
      groups: string[];
      reference?: string;
      levels?: number[];
    } = {
      theme: values.title,
      activities: acts,
      groups: fieldsGroupes.map((g) => g.value),
    };
    if (refSelect) {
      dataToSend.reference = refSelect;
    }

    if (allowedLevels.length) {
      dataToSend.levels = allowedLevels;
    }
    if (refSelect && !allowedLevels.length) {
      return setErrorMsg('Veuillez choisir au minimum 4 niveaux');
    }
    if (fieldsGroupes[0].title === '') {
      return setErrorMsg('Veuillez choisir au moins un groupe ');
    }
    return addThemeAdvisor({ variables: { ...dataToSend } });
  };

  const restFields = () => {
    actions.setValues({ title: '', activities: [] });
    setFields([{ value: '' }]);
    setFieldsGroupes([{ value: '', title: '' }]);
    setErrorMsg('');
    setRefSelect('');
    setRefSelected(null);
    setAllowedLevels([]);
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
    setErrorMsg('');
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
  const levels = [1, 2, 3, 4, 5, 6, 7, 8];
  const createHeaders: CreateHeaderType<Theme> = () => {
    return [
      {
        title: (
          <div style={{ flex: 1 }}>
            EXP??RIENCE
            <span className={classes.headerText}>ACTIVIT??S</span>
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
            <div
              className={classes.btnActon}
              onClick={() => history.push(row.reference ? `/references?id=${row.reference?.id}` : '/reference/add')}
            >
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
                      <li key={g.title} onClick={() => history.push(`/parcours?code=${g.code}`)}>
                        {g.title}
                      </li>
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
  const onSelectLevels = (level: number) => {
    let array: number[] = [];
    if (!levelFirstSelected) {
      setFirstLevel(level);
      array = [level];
      setAllowedLevels(array);
    } else if (
      (level < levelFirstSelected + 3 && levelFirstSelected < level) ||
      (levelFirstSelected >= 6 && level > levelFirstSelected - 3)
    ) {
      setErrorMsg('Veuillez choisir au minimum 4 niveaux');
    } else if (level > levelFirstSelected && levelFirstSelected < maxLevel) {
      array = levels.slice(levelFirstSelected - 1, level);
      setAllowedLevels(array);
    } else if (level < levelFirstSelected && levelFirstSelected - level >= 3) {
      array = levels.slice(level - 1, levelFirstSelected);
      setAllowedLevels(array);
    } else if (levelFirstSelected >= 6 && level === levelFirstSelected - 3) {
      array = levels.slice(levels.length - (levelFirstSelected - (level - 1)), levelFirstSelected);
      setAllowedLevels(array);
    } else if (level < levelFirstSelected && levelFirstSelected - level <= 3) {
      setErrorMsg('Veuillez choisir au minimum 4 niveaux');
    }
  };
  useEffect(() => {
    if (addThemeAdvisorState.data) {
      setOpen(false);
      setOpenGroupe(false);
      setOpenRef(false);
      setSelected(-1);
      restFields();
      listThemesAdvisor();
      setRefSelected(null);
      setMaxLevel(4);
      setAllowedLevels([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addThemeAdvisorState.data]);
  useEffect(() => {
    if (refSelected?.competences) {
      const res: number[] = [];
      refSelected.competences.map((c) => res.push(c.niveau.length));
      const min = Math.min(...res);
      setMaxLevel(min);
    }
  }, [refSelected]);

  const steps = [
    <>
      <h1 className={classes.title}>Ajouter une Exp??rience</h1>
      <div className={classes.error}>{errorMsg}</div>
      <form onSubmit={handleFirstSubmit} className={classes.inputGroupeStyle}>
        <Input
          value={values.title}
          onChange={handleChange}
          label="Nom de l???exp??rience"
          name="title"
          war={classes.war}
          containerClassName={classes.input}
          required
        />
        <Button label="valider" className={classes.validerButton} />
      </form>
      <span className={classes.aide}>Besoin d&apos;aide ?</span>
    </>,
    <>
      <h1 className={classes.title}>Ajoutez des activit??s ?? votre exp??rience</h1>
      <div className={classes.error}>{errorMsg}</div>
      <form onSubmit={handleSecondSubmit} className={classes.inputGroupeStyle}>
        {fields.map((field, idx) => {
          return (
            <div key={`${field}-${idx * 2}`}>
              <Input
                value={field.value}
                onChange={(e) => handleChangeFields(idx, e)}
                label={`Activit?? ${idx + 1}`}
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
          <span className={classes.LabelAddAct}>ajouter activit??</span>
        </div>
        <Button label="valider" className={classes.validerButton} />
      </form>
      <span className={classes.aide}>Besoin d&apos;aide ?</span>
    </>,
    <>
      <h1 className={classes.title}>Ajoutez un r??f??rentiel et partagez ?? un groupe</h1>
      <div className={classes.error}>{errorMsg}</div>
      <form className={classes.inputGroupeStyle}>
        <span className={classes.labelSelect}>r??f??rentiel</span>
        <div className={classes.btnShowRefs} onClick={() => setOpenRef(!openRef)}>
          <span className={classes.selectedOption}>
            {referenceState.data?.references.data.length !== 0 ? refSelected?.title : 'd??faut'}
          </span>
          {referenceState.data?.references.data.length !== 0 && (
            <img src={ArrowLeft} alt="arrow" className={classes.img} />
          )}
          {openRef && referenceState.data?.references.data.length !== 0 && (
            <div className={classes.optionsContainer}>
              {referenceState.data?.references.data.map((r) => (
                <p
                  key={r.id}
                  className={classes.option}
                  onClick={() => {
                    setRefSelect(r.id);
                    setRefSelected(r);
                  }}
                >
                  {r.title}
                </p>
              ))}
            </div>
          )}
        </div>
        {refSelected && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={classes.labelSelect}>Les niveaux ?? extraire (4min) </span>
              <span
                className={classes.labelSelect}
                onClick={() => {
                  setAllowedLevels([]);
                  setFirstLevel(0);
                  setErrorMsg('');
                }}
              >
                (reset)
              </span>
            </div>

            <div className={classes.levelsContainer}>
              {levels.map((level) => (
                <div
                  className={classNames(
                    classes.levelItem,
                    allowedLevels.includes(level) ? classes.selectedLevelInside : '',
                    level === allowedLevels[allowedLevels.length - 1] ? classes.selectedLevel : '',
                    level === allowedLevels[0] ? classes.selectedLevel : '',
                  )}
                  onClick={() => onSelectLevels(level)}
                  key={level}
                >
                  <span className={classNames(classes.levelText, level <= maxLevel || classes.disableLevelItem)}>
                    {level}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
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
                      key={e.title}
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
            <span className={classes.LabelAddAct}>ajouter groupe ?? qui partager</span>
          </div>
        )}
        <Button type="button" label="valider" className={classes.validerButton} onClick={handleLastSubmit} />
      </form>
      <span className={classes.aide}>Besoin d&apos;aide ?</span>
    </>,
  ];
  return (
    <div className={classes.experienceContainer}>
      <div className={classNames(classes.add)} onClick={() => setOpen(true)}>
        <img className={classes.icon} src={AddIcon} alt="" />
        ajouter une exp??rience
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
