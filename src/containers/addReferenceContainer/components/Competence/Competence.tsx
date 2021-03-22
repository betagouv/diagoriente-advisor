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
  showSubs: boolean;
  errorModal?: string;
  setErrorModal: (s: string) => void;
  onNiveauAdd: (niveau: Niveau, index: number) => void;
  onClickTitle: () => void;
}

const Competence = ({
  title,
  niveau,
  color,
  showSubs,
  errorModal,
  setErrorModal,
  onNiveauAdd,
  onClickTitle,
}: CompetenceProps) => {
  const [isOpen, setIsOpen] = useState(-1);

  const [{ values }, { handleChange, setValues }] = useForm({
    initialValues: { title: '', sub_title: '' },
    required: ['title'],
  });
  const selectedNiveau = niveau[isOpen];
  useEffect(() => {
    setValues({ title: selectedNiveau?.title || '', sub_title: selectedNiveau?.sub_title || '' });

    // eslint-disable-next-line
  }, [isOpen]);
  return (
    <div className={styles.competence}>
      <div className={styles.titleCompetence} style={{ color }} onClick={onClickTitle}>
        {title}
      </div>
      {niveau.map((n, i) => (
        // eslint-disable-next-line
        <div key={i} className={styles.niveau} onClick={() => setIsOpen(i)}>
          <span>{n.title}</span>
          {showSubs && <span className={styles.subTitle}>{n.sub_title}</span>}
        </div>
      ))}
      {niveau.length < 8 && (
        <button onClick={() => setIsOpen(niveau.length)} className={styles.btnAddLevel}>
          <Plus color="#000" width="50" height="50" strokeWidth="0.5" />
        </button>
      )}
      <Modal
        isOpen={isOpen !== -1}
        onClose={() => {
          setIsOpen(-1);
          setErrorModal('');
        }}
        widthSize="auto"
        heightSize="auto"
        bkground="#f5f6fb"
        body={styles.bodyModal}
        withoutClose={isOpen === niveau.length}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (values.title) {
              setIsOpen(-1);
              setErrorModal('');
            }
            onNiveauAdd(values, isOpen);
          }}
          className={styles.modal}
        >
          <div className={styles.titleAddLevel} style={{ color }}>
            compétence :
          </div>
          <div className={styles.titleAddLevel} style={{ color }}>
            {title}
          </div>
          <div className={styles.level}>{`NIVEAU ${isOpen + 1}`}</div>
          <p className={styles.labelInput}>descripteur</p>
          <textarea
            name="title"
            onChange={(e) => {
              handleChange(e);
              setErrorModal('');
            }}
            value={values.title}
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
            value={values.sub_title}
            className={styles.inputModalLevel}
            style={{ color: '#10255E' }}
            rows={3}
            wrap="hard"
            maxLength={100}
          />
          <div className={styles.addBtnModal}>
            <Button label={isOpen < niveau.length ? 'Modifier' : 'valider'} type="submit" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Competence;
