import { useForm } from 'common/hooks/useInputs';
import Modal from 'components/Modal/Modal';
import classesNames from 'common/utils/classNames';
import { useEffect, useState, MouseEvent } from 'react';
import Plus from 'assets/svg/addCustom';
import Button from 'components/Button/Button';
import styles from './styles.module.scss';

export interface Niveau {
  title: string;
  sub_title: string;
}

interface CompetenceProps {
  title: string;
  type: string;
  niveau: Niveau[];
  color: string;
  isUpdate: boolean;
  showsType: string[];
  errorModal?: string;
  setErrorModal: (s: string) => void;
  onNiveauAdd: (niveau: Niveau, index: number) => void;
  onClickTitle: () => void;
  setUpdate: (s: boolean) => void;
  onHoverLevel: (l: number | null) => void;
}

const Competence = ({
  title,
  type,
  niveau,
  color,
  errorModal,
  isUpdate,
  showsType,
  setUpdate,
  setErrorModal,
  onNiveauAdd,
  onClickTitle,
  onHoverLevel,
}: CompetenceProps) => {
  const [isOpen, setIsOpen] = useState(-1);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [{ values }, { handleChange, setValues }] = useForm({
    initialValues: { title: '', sub_title: '' },
    required: ['title', 'sub_title'],
  });
  const selectedNiveau = niveau[isOpen];
  useEffect(() => {
    setValues({ title: selectedNiveau?.title || '', sub_title: selectedNiveau?.sub_title || '' });

    // eslint-disable-next-line
  }, [isOpen]);

  const onDeleteRef = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setOpenDelModal(true);
  };
  return (
    <div className={styles.competence}>
      <div className={styles.titleCompetence} style={{ color }} onClick={onClickTitle}>
        {title}
      </div>
      {niveau.map((n, i) => (
        <div
          // eslint-disable-next-line
          key={i}
          className={styles.niveau}
          onClick={() => {
            setIsOpen(i);
            setUpdate(true);
          }}
        >
          <span>{n.title}</span>
          {showsType.includes(type) && <span className={styles.subTitle}>{n.sub_title}</span>}
        </div>
      ))}
      {niveau.length < 8 && (
        <button
          onClick={() => {
            setUpdate(false);
            setIsOpen(niveau.length);
          }}
          className={styles.btnAddLevel}
          onMouseEnter={() => onHoverLevel(niveau.length)}
          onMouseLeave={() => onHoverLevel(null)}
        >
          <Plus color="#000" width="50" height="50" strokeWidth="0.5" />
        </button>
      )}
      <Modal
        isOpen={isOpen !== -1}
        onClose={() => {
          setIsOpen(-1);
          setErrorModal('');
          setUpdate(false);
        }}
        className={classesNames(styles.modal_confirmation, openDelModal && styles.modal_confirmation_transition)}
        widthSize="auto"
        heightSize="auto"
        bkground="#f5f6fb"
        body={styles.bodyModal}
        withoutClose
      >
        <>
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
              <Button label="valider" type="submit" />
            </div>
            {isUpdate && (
              <div>
                <p>Vous pouver aussi supprimer ce niveau</p>
                <div className={styles.addBtnModal}>
                  <Button label="supprimer" className={styles.btnDelete} onClick={(e: any) => onDeleteRef(e)} />
                </div>
              </div>
            )}
          </form>
          {openDelModal && (
            <div className={styles.delModalContainer}>
              <div className={styles.arrow} />
              <p className={styles.text_confirmation}>Voulez-vous vraiment supprimer ce niveau ?</p>
              <div className={styles.btnDelContainer}>
                <Button label="annuler" outlined className={styles.btnCancel} onClick={() => setOpenDelModal(false)} />
                <Button label="supprimer" className={styles.btnDEL} />
              </div>
            </div>
          )}
        </>
      </Modal>
    </div>
  );
};

export default Competence;
