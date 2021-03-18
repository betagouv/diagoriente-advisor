import { useState } from 'react';
import { useReferences } from 'common/requests/reference';
import Title from 'components/Title/Title';
import ModalContainer from 'components/Modal/Modal';
import AddRefereniel from 'containers/addReferenceContainer/AddReference';
import Plus from 'assets/svg/addCustom';
import Referentiel from 'assets/svg/referentielEmpty.svg';
import EmptyCard from 'assets/svg/emptyCard.svg';
import Card from './components/Card/Card';
import classes from './reference.module.scss';

const Reference = () => {
  const { data } = useReferences();
  const [open, setOpen] = useState(false);

  if (!data) return <div />;

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

  return (
    <div className={classes.referenceContainer}>
      <div className={classes.headerRef}>
        <Title title="Mon référentiel  :" />
        <div className={classes.btnAddRef} onClick={() => setOpen(!open)}>
          <Plus width="20" height="20" color="#10255E" strokeWidth="1" />
          <span className={classes.textBtn}>Créer une déclinaison</span>
        </div>
      </div>
      <div className={classes.bodyRef}>
        {data.references.data.length ? (
          <AddRefereniel />
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
      >
        <div>
          <div className={classes.titleModal}>Création de votre référentiel</div>
          <p className={classes.subTitleModal}>
            Vous pouvez créer votre référentiel à partir d’un modèle existant ou à partir d’une grille vierge
          </p>
          <div className={classes.cardContainerRefs}>
            {array.map((d) => (
              <Card competences={d.competences} nom={d.nom} info={d.info} img={d.img} />
            ))}
          </div>
        </div>
      </ModalContainer>
    </div>
  );
};

export default Reference;
