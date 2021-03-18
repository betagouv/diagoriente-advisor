import Image from 'assets/svg/empty-group.svg';
import AddGroup from '../AddGroup/AddGroup';
import classes from './styles.module.scss';

const EmptyGroup = () => (
  <div className={classes.container}>
    <div className={classes.content}>
      <img src={Image} alt="" className={classes.img} />
      <div className={classes.absolute_fill}>
        <span className={classes.title}>Ajouter un groupe</span>
        <span className={classes.subtitle}>
          Créez d’abord votre groupe en cliquant sur le bouton “Ajouter”, puis générez un code groupe et invitez vos
          membres
        </span>
      </div>
    </div>
    <AddGroup className={classes.add} />
  </div>
);

export default EmptyGroup;
