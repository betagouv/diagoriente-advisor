import { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAddReference, AddReferenceArguments, useUpdateReference, useReference } from 'common/requests/reference';
import useSnackBar from 'common/hooks/useSnackBar';
import Modal from 'components/Modal/Modal';
import Title from 'components/Title/Title';
import { useForm } from 'common/hooks/useInputs';
import { groupBy, omit } from 'lodash';

import Plus from 'assets/svg/addCustom';
import openeye from 'assets/svg/openEye.svg';
import closeeye from 'assets/svg/closeEye.svg';

import Button from 'components/Button/Button';
import classesNames from 'common/utils/classNames';
import Competence, { Niveau } from './components/Competence/Competence';
import styles from './components/Competence/styles.module.scss';

interface IProps {
  dataToShow?: any;
  isUpdate: boolean;
  setUpdate: (s: boolean) => void;
}

const competenceTypes = [
  { title: 'pôle organisationnel', type: 'organizational', color: '#0087AF' },
  { title: 'pôle communicationnel', type: 'communication', color: '#77BB91' },
  { title: 'pôle réflexif', type: 'reflective', color: '#F2A900' },
];

const AddReference = ({ dataToShow, isUpdate, setUpdate }: IProps) => {
  const history = useHistory();
  const location = useLocation();
  const { open } = useSnackBar();
  const refOldCmpt = useRef<{} | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [errorModal, setErrorModal] = useState('');
  const [showsTypes, setShowsType] = useState<string[]>(['', '', '']);
  const [showSubsOrgs, setShowSubsOrgs] = useState(false);
  const [showSubsCom, setShowSubsCom] = useState(false);
  const [showSubsRef, setShowSubsRef] = useState(false);

  const [hoverLevel, setHoverLevel] = useState<number | null>(null);
  const [selectedCmp, setSelectedCmp] = useState(null as { title: string; type: string; color: string } | null);

  const [selectedType, setSelectedType] = useState(null as { title: string; type: string; color: string } | null);
  const [{ values }, { handleChange, setValues }] = useForm({ initialValues: { title: '' }, required: ['title'] });
  const [addReferenceCall, addReferenceState] = useAddReference();
  const [updateReferenceCall, updateReferenceState] = useUpdateReference();
  const [getRefCall, getRefState] = useReference({ fetchPolicy: 'network-only' });
  const [competences, setCompetences] = useState(
    {} as {
      [key: string]: {
        title: string;
        niveau: Niveau[];
      }[];
    },
  );
  // add uSeEffect
  useEffect(() => {
    if (addReferenceState.data) {
      open('Votre référentiel a été bien ajouté');
      history.push('/references');
      setError('');
    }
    // eslint-disable-next-line
  }, [addReferenceState.data]);
  // errors
  useEffect(() => {
    if (addReferenceState.error?.message) setError(addReferenceState.error?.message);
    if (updateReferenceState.error?.message) {
      setError(updateReferenceState.error?.message);
    }
  }, [addReferenceState.error, updateReferenceState.error]);
  useEffect(() => {
    if (location.search.slice(4)) {
      setError('');
      setErrorModal('');
    }
  }, [location]);
  // clear data
  useEffect(() => {
    if (!selectedType) {
      setValues({ title: '' });
    }
    // eslint-disable-next-line
  }, [selectedType]);
  // initialise 1st to show
  useEffect(() => {
    if (dataToShow) {
      const c = groupBy(dataToShow.competences, 'type');
      setCompetences(c);
      refOldCmpt.current = c;
      setUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataToShow]);
  // ref oldCmp
  useEffect(() => {
    if (refOldCmpt.current) {
      if (refOldCmpt.current !== competences) {
        setUpdate(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refOldCmpt.current, competences]);
  // update uSeEffect
  useEffect(() => {
    if (updateReferenceState.data) {
      open('Vos données ont été sauvegardées');
      getRefCall({ variables: { id: location.search.slice(4) } });
      setUpdate(false);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateReferenceState.data]);
  // initialise title
  useEffect(() => {
    if (selectedCmp?.title) {
      setValues({ title: selectedCmp?.title });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCmp?.title]);
  useEffect(() => {
    if (getRefState.data) {
      const c = groupBy(getRefState.data.reference.competences, 'type');
      setCompetences(c);
      setUpdate(false);
      refOldCmpt.current = c;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRefState.data]);
  const onOpenUpdateCompetence = (cmp: any) => {
    setSelectedType(cmp);
    setSelectedCmp(cmp);
    setUpdate(true);
  };
  const onHoverLevel = (level: number | null) => {
    setHoverLevel(level);
  };
  const onCLickBtn = () => {
    if (isUpdate) {
      const cmps = ([] as AddReferenceArguments['competences']).concat(
        ...Object.keys(competences).map((key) =>
          competences[key].map((c) => ({
            title: c.title,
            type: key,
            niveau: c.niveau.map((n) => omit(n, '__typename')),
          })),
        ),
      );
      updateReferenceCall({
        variables: {
          id: location.search.slice(4),
          title: dataToShow.title,
          competences: cmps.map((cmp) => omit(cmp, '__typename')),
        },
      });
    } else {
      addReferenceCall({
        variables: {
          title,
          competences: ([] as AddReferenceArguments['competences']).concat(
            ...Object.keys(competences).map((key) => competences[key].map((c) => ({ ...c, type: key }))),
          ),
        },
      });
    }
  };
  const insert = (arr: any[], index: number, newItem: any) => {
    return [...arr.slice(0, index), newItem, ...arr.slice(index)];
  };
  const hasLevel = (arr: { title: string; niveau: Niveau[] }[]) => {
    let res = false;
    const r = arr.find((c) => c.niveau.length !== 0);
    if (r) {
      res = true;
    }
    return res;
  };
  return (
    <div className={styles.containerAdd}>
      {location.pathname === '/reference/add' && (
        <div className={styles.headerRef}>
          <Title title="Mon référentiel :" className={styles.titlePage} />
          <input
            placeholder="Nommez ici votre référentiel"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            className={styles.inputAdd}
          />
        </div>
      )}

      <div className={styles.bodyContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            {(addReferenceState.called || updateReferenceState.called) && (
              <p className={styles.errorTextModal}>{error}</p>
            )}
          </div>
          <div className={styles.btnSaveContainer}>
            <Button
              className={styles.btnSave}
              disable={(title.length === 0 && !isUpdate) || (refOldCmpt.current === competences && isUpdate)}
              containerStyle={styles.disableAddBtn}
              label="Enregistrer"
              loader={updateReferenceState.loading || addReferenceState.loading}
              onClick={onCLickBtn}
            />
          </div>
        </div>
        <div className={styles.competenceHeader}>
          <span className={classesNames(styles.headerArray, styles.firstLabel)}>compétences</span>
          {[...Array(8)].map((a, i) => (
            <span key={a} className={classesNames(styles.headerArray, i === hoverLevel && styles.levelToAdd)}>
              {i + 1}
            </span>
          ))}
        </div>
        {competenceTypes.map((competenceType) => {
          return (
            <>
              <div className={styles.rowCompetenceContainer}>
                <div className={styles.indicateur} style={{ background: competenceType.color }} />
                <span className={styles.rowCompetence} style={{ color: competenceType.color }}>
                  {competenceType.title}
                </span>
                <button
                  onClick={() => setSelectedType(competenceType)}
                  className={styles.btnAdd}
                  style={{ background: competences[competenceType.type]?.length === 5 ? 'grey' : competenceType.color }}
                  disabled={competences[competenceType.type]?.length === 5}
                >
                  <div className={styles.img}>
                    <Plus width="12" height="12" color="#fff" strokeWidth="3" />
                  </div>
                  <span className={styles.textAdd}>Ajouter</span>
                </button>
                {competences[competenceType.type]?.length === 5 && (
                  <span className={styles.infoAddCmp}>Vous avez déjà ajouté 5 compétences</span>
                )}

                {competences[competenceType.type] && hasLevel(competences[competenceType.type]) && (
                  <div
                    className={styles.indicateurSubs}
                    onClick={() => {
                      if (competenceType.type === 'organizational') {
                        const arr = [...showsTypes];
                        if (showSubsOrgs) {
                          arr[0] = '';
                          setShowSubsOrgs(false);
                        } else {
                          arr[0] = competenceType.type;
                          setShowSubsOrgs(true);
                        }
                        setShowsType(arr);
                      }
                      if (competenceType.type === 'communication') {
                        const arr = [...showsTypes];
                        if (showSubsCom) {
                          arr[1] = '';
                          setShowSubsCom(false);
                        } else {
                          arr[1] = competenceType.type;
                          setShowSubsCom(true);
                        }
                        setShowsType(arr);
                      }
                      if (competenceType.type === 'reflective') {
                        const arr = [...showsTypes];
                        if (showSubsRef) {
                          arr[2] = '';
                          setShowSubsRef(false);
                        } else {
                          arr[2] = competenceType.type;
                          setShowSubsRef(true);
                        }
                        setShowsType(arr);
                      }
                    }}
                  >
                    <img
                      src={
                        (showSubsOrgs && showsTypes.includes(competenceType.type)) ||
                        (showSubsCom && showsTypes.includes(competenceType.type)) ||
                        (showSubsRef && showsTypes.includes(competenceType.type))
                          ? openeye
                          : closeeye
                      }
                      alt="subs"
                    />
                    <span className={styles.indicateurSubsText}>indicateur</span>
                  </div>
                )}
              </div>
              {competences[competenceType.type]?.map((competence, i) => {
                return (
                  <Competence
                    // eslint-disable-next-line
                    key={i}
                    onNiveauAdd={(niveau, index) => {
                      if (niveau.title && niveau.sub_title) {
                        const nextCompetencesType = [...competences[competenceType.type]];

                        if (index < competence.niveau.length) {
                          const nextNiveau = [...competence.niveau];
                          nextNiveau[index] = niveau;
                          const nextCompetence = { ...competence, niveau: nextNiveau };
                          nextCompetencesType[i] = nextCompetence;
                        } else {
                          const nextCompetence = { ...competence, niveau: [...competence.niveau, niveau] };
                          nextCompetencesType[i] = nextCompetence;
                        }

                        setCompetences({ ...competences, [competenceType.type]: nextCompetencesType });
                      } else {
                        setErrorModal('Ce champ est obligatoire');
                      }
                    }}
                    onNiveauDelete={(index) => {
                      const nextCompetencesType = [...competences[competenceType.type]];
                      const nextNiveau = [...competence.niveau];
                      const newniveau = nextNiveau
                        .slice(0, index)
                        .concat(nextNiveau.slice(index + 1, nextNiveau.length));
                      const nextCompetence = { ...competence, niveau: newniveau };
                      nextCompetencesType[i] = nextCompetence;
                      setCompetences({ ...competences, [competenceType.type]: nextCompetencesType });
                    }}
                    onHoverLevel={onHoverLevel}
                    errorModal={errorModal}
                    setErrorModal={setErrorModal}
                    title={competence.title}
                    type={competenceType.type}
                    niveau={competence.niveau}
                    color={competenceType.color}
                    isUpdate={isUpdate}
                    showsType={showsTypes}
                    setUpdate={setUpdate}
                    onClickTitle={() =>
                      onOpenUpdateCompetence({
                        type: competenceType.type,
                        title: competence.title,
                        color: competenceType.color,
                      })
                    }
                  />
                );
              })}
            </>
          );
        })}

        <Modal
          isOpen={!!selectedType}
          onClose={() =>
            isUpdate
              ? (setSelectedType(null),
                setUpdate(false),
                setErrorModal(''),
                setValues({ title: '' }),
                setSelectedCmp(null))
              : (setSelectedType(null),
                setErrorModal(''),
                setValues({ title: '' }),
                setUpdate(false),
                setSelectedCmp(null))
          }
          widthSize="auto"
          heightSize="auto"
          bkground="#f5f6fb"
          body={styles.bodyModal}
          withoutClose
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedType) {
                const nextCompetence = { title: values.title, type: selectedType.type, niveau: [] };
                if (nextCompetence.title) {
                  if (isUpdate && selectedCmp) {
                    const getIndex = competences[selectedType.type].findIndex((c) => c.title === selectedType.title);
                    const currentTypesCmp = competences[selectedType.type].find((c) => c.title === selectedType.title);
                    const cmps = competences[selectedType.type].filter((c) => c.title !== selectedType.title);
                    if (currentTypesCmp?.niveau) {
                      const newData = {
                        title: values.title,
                        niveau: currentTypesCmp.niveau,
                        type: selectedType.type,
                        __typename: 'referenceCompetence',
                      };
                      const res = insert(cmps, getIndex, newData);
                      setCompetences({
                        ...competences,
                        [selectedType.type]: res,
                      });
                    }
                  } else {
                    setCompetences({
                      ...competences,
                      [selectedType.type]: competences[selectedType.type]
                        ? [...competences[selectedType.type], nextCompetence]
                        : [nextCompetence],
                    });
                  }

                  setSelectedType(null);
                } else {
                  setErrorModal('Le champ compétence est obligatoire');
                }
              }
            }}
            className={styles.modal}
          >
            <h1 className={styles.title} style={{ color: selectedType?.color || selectedType?.color }}>
              {(selectedCmp && competenceTypes.find((c) => c.type === selectedCmp.type)?.title) || selectedType?.title}
            </h1>
            <div>
              <p className={styles.labelInput}>compétence</p>
            </div>
            <textarea
              name="title"
              onChange={(e) => {
                handleChange(e);
                setErrorModal('');
              }}
              value={values.title}
              className={styles.inputModal}
              style={{
                color: selectedType?.color || selectedType?.color,
                border: errorModal ? '1px solid red' : '',
              }}
              rows={3}
              wrap="hard"
              maxLength={100}
            />
            <span className={styles.errorTextModal}>{errorModal}</span>

            <div className={styles.addBtnModal}>
              <Button label="valider" />
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AddReference;
