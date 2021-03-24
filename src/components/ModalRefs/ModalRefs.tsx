import React from 'react';
import Button from 'components/Button/Button';
import CloseIcon from 'assets/svg/close icon.svg';
import Plus from 'assets/svg/addCustom';
import classes from './styles.module.scss';

interface IProps {
  listRefs?: { title: string; id: string }[];
  openDelModal: boolean;
  deletedRef: string;
  open: boolean;
  setOpenDelModal: (s: boolean) => void;
  setOpen: (s: boolean) => void;
  onClickRow: (c: string) => void;
  onDeleteRef: (e: any, c: string) => void;
  deletRef: () => void;
}

const ModalRefs = ({
  listRefs,
  openDelModal,
  deletedRef,
  open,
  deletRef,
  setOpen,
  setOpenDelModal,
  onClickRow,
  onDeleteRef,
}: IProps) => {
  return (
    <div className={classes.containerRefsList}>
      <p className={classes.text_confirmation}>Mes référentiels</p>
      {listRefs?.map((c) => {
        return (
          <div className={classes.rowRef} key={c.id}>
            <div className={classes.text} onClick={() => onClickRow(c.id)}>
              <span className={classes.textBtn}>{c.title}</span>
            </div>
            <div onClick={(e) => onDeleteRef(e, c.id)} className={classes.delContainer}>
              <img src={CloseIcon} alt="del" className={classes.imgClose} />
            </div>
            {openDelModal && deletedRef === c.id && (
              <div className={classes.delModalContainer}>
                <div className={classes.arrow} />
                <p className={classes.text_confirmation}>Voulez-vous vraiment supprimer ce référentiel ?</p>
                <div className={classes.btnDelContainer}>
                  <Button
                    label="annuler"
                    outlined
                    className={classes.btnCancel}
                    onClick={() => setOpenDelModal(false)}
                  />
                  <Button label="supprimer" className={classes.btnDEL} onClick={deletRef} />
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div className={classes.separator} />
      <div className={classes.btnAddStandard} onClick={() => setOpen(!open)}>
        <Plus width="20" height="20" color="#10255E" strokeWidth="1" />
        <span className={classes.textBtn}>Créer une déclinaison</span>
      </div>
    </div>
  );
};

export default ModalRefs;
