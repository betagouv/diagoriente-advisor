import { useState, useEffect } from 'react';
import { useReferences, useDeleteRef, useReference } from 'common/requests/reference';
import classesNames from 'common/utils/classNames';
import { useDidMount } from 'common/hooks/useLifeCycle';
import Title from 'components/Title/Title';
import ModalContainer from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import AddRefereniel from 'containers/addReferenceContainer/AddReference';
import Plus from 'assets/svg/addCustom';
import Referentiel from 'assets/svg/referentielEmpty.svg';
import EmptyCard from 'assets/svg/emptyCard.svg';
import ArrowLeft from 'assets/svg/arrow-left.svg';
import CloseIcon from 'assets/svg/close icon.svg';
import { useHistory } from 'react-router-dom';
import Card from './components/Card/Card';
import classes from './reference.module.scss';

const ReferenceContainer = () => {
  const history = useHistory();
  const [getListRefCall, getListRefState] = useReferences({ fetchPolicy: 'network-only' });
  const [open, setOpen] = useState(false);
  const [isUpdate, setUpdate] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [deletedRef, setDeleteRef] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const [getRefCall, getRefState] = useReference();
  const [deleteReferenceCall, deleteReferenceState] = useDeleteRef();
  const array = [
    {
      competences: [
        { title: 'pôle organisationnel', value: 4, color: '#0087AF' },
        { title: 'pôle communicationnel', value: 4, color: '#77BB91' },
        { title: 'pôle réflexif', value: 4, color: '#F2A900' },
      ],
      nom: 'RECTEC tous secteurs',
      info: `Carte de 12 compétences faites à partir du Lorem ipsum dolor sit amet, 
        consectetur adipiscing elit, sed do eiusmod tempor incididunt .`,
    },
    {
      competences: [
        { title: 'pôle organisationnel', value: 4, color: '#0087AF' },
        { title: 'pôle communicationnel', value: 4, color: '#77BB91' },
        { title: 'pôle réflexif', value: 4, color: '#F2A900' },
      ],
      nom: 'RECTEC Petite Enfance',
      info: `Déclinaison officielle faite dans le cadre de Lorem ipsum dolor sit amet, 
        consectetur adipiscing elit, sed do eiusmod tempor incididunt.`,
    },
    {
      img: EmptyCard,
      nom: 'Nouvelle carte',
      info: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
  ];

  useDidMount(() => {
    getListRefCall();
  });
  const onClickRow = (id: string) => {
    setOpenFilter(false);
    setSelectedId(id);
    return history.replace(`/references?id=${id}`);
  };
  const onDeleteRef = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    setOpenDelModal(true);
    setDeleteRef(id);
  };
  const deletRef = () => {
    deleteReferenceCall({ variables: { id: deletedRef } });
  };

  useEffect(() => {
    if (getListRefState.data?.references.data.length) {
      history.replace(`/references?id=${getListRefState.data.references.data[0].id}`);
      getRefCall({ variables: { id: getListRefState.data.references.data[0].id } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getListRefState.data, history]);
  useEffect(() => {
    if (selectedId) {
      getRefCall({ variables: { id: selectedId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);
  useEffect(() => {
    if (deleteReferenceState.data) {
      getListRefCall();

      setOpenFilter(false);
      setOpenDelModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteReferenceState.data]);

  return (
    <div className={classes.referenceContainer}>
      <div className={classes.headerRef}>
        <Title title="Mon référentiel  :" className={classes.titlePage} />
        {getListRefState.data?.references.data.length ? (
          <>
            <div className={classesNames(classes.titleRefHeader, classes.titlePage)}>
              {getRefState.data?.reference.title}
            </div>
            <div className={classes.btnShowRefs} onClick={() => setOpenFilter(!openFilter)}>
              <img src={ArrowLeft} alt="arrow" className={classes.img} />
            </div>
          </>
        ) : (
          <div className={classes.btnAddRef} onClick={() => setOpen(!open)}>
            <Plus width="20" height="20" color="#10255E" strokeWidth="1" />
            <span className={classes.textBtn}>Créer une déclinaison</span>
          </div>
        )}
      </div>
      <div className={classes.bodyRef}>
        {getListRefState.data?.references.data.length ? (
          <AddRefereniel dataToShow={getRefState.data?.reference} setUpdate={setUpdate} isUpdate={isUpdate} />
        ) : (
          <div className={classes.content}>
            <div className={classes.info}>
              <p className={classes.titleRef}>Créez votre déclinaison de référentiel</p>
              <p className={classes.subTitleRef}>
                en sélectionnant le modèle RECTEC ou une déclinaison exitante, redéfinissez les compétences et ses
                composantes.
              </p>
              <img src={Referentiel} alt="" />
            </div>
          </div>
        )}
      </div>
      <ModalContainer
        isOpen={open}
        onClose={() => setOpen(false)}
        className={classes.modal_confirmation}
        widthSize="95%"
        heightSize="98%"
      >
        <div>
          <div className={classes.titleModal}>Création de votre référentiel</div>
          <p className={classes.subTitleModal}>
            Vous pouvez créer votre référentiel à partir d’un modèle existant ou à partir d’une grille vierge
          </p>
          <div className={classes.cardContainerRefs}>
            {array.map((d) => (
              <Card key={d.nom} competences={d.competences} nom={d.nom} info={d.info} img={d.img} />
            ))}
          </div>
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={openFilter}
        onClose={() => {
          setOpenFilter(false);
          setOpenDelModal(false);
        }}
        className={classesNames(classes.modal_confirmation, openDelModal && classes.modal_confirmation_transition)}
        bkground="#fff"
        widthSize="auto"
        heightSize="auto"
        body={classes.bodyModal}
        withoutClose
      >
        <div className={classes.containerRefsList}>
          <p className={classes.text_confirmation}>Mes Référentiels</p>
          {getListRefState.data?.references.data.map((c) => {
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
      </ModalContainer>
    </div>
  );
};

export default ReferenceContainer;
