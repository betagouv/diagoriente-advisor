import { useForm } from 'common/hooks/useInputs';
import Modal from 'components/Modal/Modal';
import { useEffect, useState } from 'react';
import Plus from 'assets/svg/addCustom';
import Button from 'components/Button/Button';
import styles from './styles.module.scss';

export interface Niveau {
  title: string;
  sub_title: string;
}

interface CompetenceProps {
  title: string;
  niveau: Niveau[];
  color: string;
  onNiveauAdd: (niveau: Niveau) => void;
}

const Competence = ({ title, niveau, color, onNiveauAdd }: CompetenceProps) => {
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
      <div className={styles.titleCompetence} style={{ color }}>
        {title}
      </div>
      {niveau.map((n, i) => (
        // eslint-disable-next-line
        <div key={i} className={styles.niveau}>
          {n.title}
        </div>
      ))}
      {niveau.length < 8 && (
        <button onClick={() => setIsOpen(true)} className={styles.btnAddLevel}>
          <Plus color="#000" width="50" height="50" strokeWidth="0.5" />
        </button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        widthSize="auto"
        heightSize="auto"
        bkground="#f5f6fb"
        body={styles.bodyModal}
        withoutClose
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNiveauAdd(values);
            setIsOpen(false);
          }}
          className={styles.modal}
        >
          <div className={styles.titleAddLevel} style={{ color }}>
            compétence :
          </div>
          <div className={styles.titleAddLevel} style={{ color }}>
            {title}
          </div>
          <div className={styles.level}>{`NIVEAU ${niveau.length + 1}`}</div>
          <p className={styles.labelInput}>descripteur</p>
          <textarea
            name="title"
            onChange={handleChange}
            value={values.title}
            className={styles.inputModalLevel}
            style={{ color: '#10255E' }}
            rows={3}
            wrap="hard"
            maxLength={100}
          />
          <p className={styles.labelInput}>indicateur</p>
          <textarea
            name="sub_title"
            onChange={handleChange}
            value={values.sub_title}
            className={styles.inputModalLevel}
            style={{ color: '#10255E' }}
            rows={3}
            wrap="hard"
            maxLength={100}
          />
          <div className={styles.addBtnModal}>
            <Button label="valider" type="submit" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Competence;
