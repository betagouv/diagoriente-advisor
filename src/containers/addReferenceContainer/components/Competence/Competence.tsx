import { useForm } from 'common/hooks/useInputs';
import Modal from 'components/Modal/Modal';
import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

export interface Niveau {
  title: string;
  sub_title: string;
}

interface CompetenceProps {
  title: string;
  niveau: Niveau[];
  onNiveauAdd: (niveau: Niveau) => void;
}

const Competence = ({ title, niveau, onNiveauAdd }: CompetenceProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [{ values }, { handleChange, setValues }] = useForm({
    initialValues: { title: '', sub_title: '' },
    required: ['title'],
  });

  useEffect(() => {
    if (isOpen) setValues({ title: '', sub_title: '' });
    // eslint-disable-next-line
  }, [isOpen]);

  return (
    <div className={styles.competence}>
      <div className={styles.title}>{title}</div>
      {niveau.map((n, i) => (
        // eslint-disable-next-line
        <div key={i} className={styles.niveau}>
          {n.title}
        </div>
      ))}
      {niveau.length < 8 && <button onClick={() => setIsOpen(true)}>+</button>}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNiveauAdd(values);
            setIsOpen(false);
          }}
          className={styles.modal}
        >
          <div className={styles.title}>compétence :</div>
          <div className={styles.title}>{title}</div>
          <div>{`NIVEAU ${niveau.length + 1}`}</div>
          <input name="title" onChange={handleChange} value={values.title} />
          <input name="sub_title" onChange={handleChange} value={values.sub_title} />
          <button>Valider</button>
        </form>
      </Modal>
    </div>
  );
};

export default Competence;
