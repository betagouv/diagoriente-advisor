import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAddReference, AddReferenceArguments } from 'common/requests/reference';
import Modal from 'components/Modal/Modal';
import Title from 'components/Title/Title';
import { useForm } from 'common/hooks/useInputs';
import { groupBy } from 'lodash';

import Plus from 'assets/svg/addCustom';
import openeye from 'assets/svg/openEye.svg';
import closeeye from 'assets/svg/closeEye.svg';

import Button from 'components/Button/Button';
import classesNames from 'common/utils/classNames';
import Competence, { Niveau } from './components/Competence/Competence';
import styles from './components/Competence/styles.module.scss';

interface IProps {
  dataToShow?: any;
}

const competenceTypes = [
  { title: 'pôle organisationnel', type: 'organizational', color: '#0087AF' },
  { title: 'pôle communicationnel', type: 'communication', color: '#77BB91' },
  { title: 'pôle réflexif', type: 'reflective', color: '#F2A900' },
];

const AddReference = ({ dataToShow }: IProps) => {
  const history = useHistory();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [showSubs, setShowSubs] = useState(false);

  const [isUpdate, setUpdate] = useState(false);
  const [selectedCmp, setSelectedCmp] = useState(null as { title: string; type: string; color: string } | null);
  const [openCmp, setOpenCmp] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [selectLevel, setSelectLevel] = useState({} as { title: string; sub_title: string });

  const [selectedType, setSelectedType] = useState(null as { title: string; type: string; color: string } | null);
  const [{ values }, { handleChange, setValues }] = useForm({ initialValues: { title: '' }, required: ['title'] });
  const [addReferenceCall, addReferenceState] = useAddReference();
  const [competences, setCompetences] = useState(
    {} as {
      [key: string]: {
        title: string;
        niveau: Niveau[];
      }[];
    },
  );
  useEffect(() => {
    if (addReferenceState.data) {
      history.push('/references');
    } else {
      if (addReferenceState.error?.graphQLErrors.length !== 0) {
        if (
          addReferenceState.error?.graphQLErrors[0].message &&
          typeof addReferenceState.error?.graphQLErrors[0].message === 'object'
        ) {
          setError((addReferenceState.error?.graphQLErrors[0].message as any).message);
        } else if (
          addReferenceState.error?.graphQLErrors[0].message &&
          typeof addReferenceState.error?.graphQLErrors[0].message === 'string'
        ) {
          setError(addReferenceState.error?.graphQLErrors[0].message);
        }
      }
      if (addReferenceState.error?.message && addReferenceState.error?.graphQLErrors.length === 0) {
        setError(addReferenceState.error?.message);
      }
    }
    // eslint-disable-next-line
  }, [addReferenceState.data]);
  useEffect(() => {
    if (!selectedType) {
      setValues({ title: '' });
    }
    // eslint-disable-next-line
  }, [selectedType]);
  useEffect(() => {
    if (dataToShow) {
      const c = groupBy(dataToShow.competences, 'type');
      setCompetences(c);
    }
  }, [dataToShow]);

  const onOpenUpdateCompetence = (cmp: any) => {
    setSelectedCmp(cmp);
    setUpdate(true);
    setOpenCmp(true);
  };
  const onOpenUpdateLevel = (level: any) => {
    console.log('level', level);
    setSelectLevel(level);
    setOpenLevel(true);
    setUpdate(true);
  };
  console.log('selectedCmp', selectedCmp, 'isUpdate', isUpdate);
  return (
    <div className={styles.containerAdd}>
      {location.pathname === '/reference/add' && (
        <div className={styles.headerRef}>
          <Title title="Mon référentiel :" className={styles.titlePage} />
          <input
            placeholder="Nommez ici votre référentiel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputAdd}
          />
        </div>
      )}
      <div>
        <p>{error}</p>
        {location.pathname === '/reference/add' && (
          <div className={styles.btnSaveContainer}>
            <Button
              className={styles.btnSave}
              label="Enregistrer"
              onClick={() => {
                addReferenceCall({
                  variables: {
                    title,
                    competences: ([] as AddReferenceArguments['competences']).concat(
                      ...Object.keys(competences).map((key) => competences[key].map((c) => ({ ...c, type: key }))),
                    ),
                  },
                });
              }}
            />
          </div>
        )}
      </div>

      <div className={styles.bodyContent}>
        <div className={styles.competenceHeader}>
          <span className={styles.headerArray}>compétences</span>
          {[...Array(8)].map((a, i) => (
            <span key={a} className={classesNames(styles.headerArray /* , i + 1 === 1 && styles.levelToAdd */)}>
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
                  style={{ background: competenceType.color }}
                >
                  <div className={styles.img}>
                    <Plus width="12" height="12" color="#fff" strokeWidth="3" />
                  </div>
                  <span className={styles.textAdd}>Ajouter</span>
                </button>
                <div className={styles.indicateurSubs} onClick={() => setShowSubs(!showSubs)}>
                  <img src={showSubs ? openeye : closeeye} alt="subs" />
                  <span className={styles.indicateurSubsText}>indicateur</span>
                </div>
              </div>
              {competences[competenceType.type]?.map((competence, i) => {
                return (
                  <Competence
                    // eslint-disable-next-line
                    key={i}
                    onNiveauAdd={(niveau) => {
                      const nextCompetencesType = [...competences[competenceType.type]];
                      const nextCompetence = { ...competence, niveau: [...competence.niveau, niveau] };
                      nextCompetencesType[i] = nextCompetence;
                      setCompetences({ ...competences, [competenceType.type]: nextCompetencesType });
                    }}
                    title={competence.title}
                    niveau={competence.niveau}
                    color={competenceType.color}
                    openLevel={openLevel}
                    isUpdate={isUpdate}
                    showSubs={showSubs}
                    setOpenLevel={setOpenLevel}
                    selectLevel={selectLevel}
                    onClickTitle={() =>
                      onOpenUpdateCompetence({
                        type: competenceType.title,
                        title: competence.title,
                        color: competenceType.color,
                      })
                    }
                    onClickLevel={onOpenUpdateLevel}
                  />
                );
              })}
            </>
          );
        })}

        <Modal
          isOpen={!isUpdate ? !!selectedType : !!openCmp}
          onClose={() => (isUpdate ? (setSelectedCmp(null), setUpdate(false)) : setSelectedType(null))}
          widthSize="auto"
          heightSize="auto"
          bkground="#f5f6fb"
          body={styles.bodyModal}
          withoutClose={!isUpdate}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedType) {
                const nextCompetence = { title: values.title, type: selectedType.type, niveau: [] };
                setCompetences({
                  ...competences,
                  [selectedType.type]: competences[selectedType.type]
                    ? [...competences[selectedType.type], nextCompetence]
                    : [nextCompetence],
                });
                setSelectedType(null);
              }
            }}
            className={styles.modal}
          >
            <h1 className={styles.title} style={{ color: selectedCmp?.color || selectedType?.color }}>
              {selectedCmp?.type || selectedType?.title}
            </h1>
            <div>
              <p className={styles.labelInput}>compétence</p>
            </div>
            <textarea
              name="title"
              onChange={handleChange}
              value={selectedCmp?.title || values.title}
              className={styles.inputModal}
              style={{ color: selectedCmp?.color || selectedType?.color }}
              rows={3}
              wrap="hard"
              maxLength={100}
            />
            <div className={styles.addBtnModal}>
              <Button label={isUpdate ? 'Modifier' : 'valider'} />
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AddReference;
