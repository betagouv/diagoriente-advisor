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
  openLevel: boolean;
  isUpdate: boolean;
  selectLevel: Niveau;
  showSubs: boolean;
  errorModal?: string;
  setErrorModal: (s: string) => void;
  onNiveauAdd: (niveau: Niveau) => void;
  onClickTitle: () => void;
  onClickLevel: (n: Niveau) => void;
  setOpenLevel: (e: boolean) => void;
}

const Competence = ({
  title,
  niveau,
  color,
  openLevel,
  isUpdate,
  selectLevel,
  showSubs,
  errorModal,
  setErrorModal,
  onNiveauAdd,
  onClickTitle,
  onClickLevel,
  setOpenLevel,
}: CompetenceProps) => {
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
      <div className={styles.titleCompetence} style={{ color }} onClick={onClickTitle}>
        {title}
      </div>
      {niveau.map((n, i) => (
        // eslint-disable-next-line
        <div key={i} className={styles.niveau} onClick={() => onClickLevel(n)}>
          <span>{n.title}</span>
          {showSubs && <span className={styles.subTitle}>{n.sub_title}</span>}
        </div>
      ))}
      {niveau.length < 8 && (
        <button onClick={() => setIsOpen(true)} className={styles.btnAddLevel}>
          <Plus color="#000" width="50" height="50" strokeWidth="0.5" />
        </button>
      )}
      <Modal
        isOpen={isOpen || openLevel}
        onClose={() => {
          setOpenLevel(false);
          setErrorModal('');
        }}
        widthSize="auto"
        heightSize="auto"
        bkground="#f5f6fb"
        body={styles.bodyModal}
        withoutClose={!isUpdate}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (values.title) {
              setIsOpen(false);
              setErrorModal('');
            }
            onNiveauAdd(values);
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
            onChange={(e) => {
              handleChange(e);
              setErrorModal('');
            }}
            value={selectLevel.title || values.title}
            className={styles.inputModalLevel}
            style={{ color: '#10255E', border: errorModal ? '1px solid red' : '' }}
            rows={3}
            wrap="hard"
            maxLength={100}
          />
          <span className={styles.errorTextModal}>{errorModal}</span>
          <p className={styles.labelInput}>indicateur</p>
          <textarea
            name="sub_title"
            onChange={handleChange}
            value={selectLevel.sub_title || values.sub_title}
            className={styles.inputModalLevel}
            style={{ color: '#10255E' }}
            rows={3}
            wrap="hard"
            maxLength={100}
          />
          <div className={styles.addBtnModal}>
            <Button label={isUpdate ? 'Modifier' : 'valider'} type="submit" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Competence;
