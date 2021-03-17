import { useEffect, useState } from 'react';
import Modal from 'components/Modal/Modal';

import { useForm } from 'common/hooks/useInputs';
import { useAddReference, AddReferenceArguments } from 'common/requests/reference';
import { RouteComponentProps } from 'react-router-dom';
import Competence, { Niveau } from './components/Competence/Competence';

import styles from './components/Competence/styles.module.scss';

const competenceTypes = [
  { title: 'pôle organisationnel', type: 'organizational' },
  { title: 'pôle communicationnel', type: 'communication' },
  { title: 'pôle réflexif', type: 'reflective' },
];

const AddReference = ({ history }: RouteComponentProps) => {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState(null as { title: string; type: string } | null);
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
    }
    // eslint-disable-next-line
  }, [addReferenceState.data]);

  useEffect(() => {
    if (!selectedType) {
      setValues({ title: '' });
    }
    // eslint-disable-next-line
  }, [selectedType]);

  return (
    <div>
      <div>
        Mon référentiel :
        <input placeholder="Nommez ici votre référentiel" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className={styles.competence}>
        <div>compétences</div>
        {[...Array(8)].map((a, i) => (
          <div>{i + 1}</div>
        ))}
      </div>
      {competenceTypes.map((competenceType) => {
        return (
          <>
            <div>
              {competenceType.title}
              <button onClick={() => setSelectedType(competenceType)}>+</button>
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
                />
              );
            })}
          </>
        );
      })}
      <button
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
      >
        Ajouter
      </button>
      <Modal isOpen={!!selectedType} onClose={() => setSelectedType(null)}>
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
          <div className={styles.title}>{selectedType?.title}</div>
          <input name="title" onChange={handleChange} value={values.title} />
          <button>Valider</button>
        </form>
      </Modal>
    </div>
  );
};

export default AddReference;
