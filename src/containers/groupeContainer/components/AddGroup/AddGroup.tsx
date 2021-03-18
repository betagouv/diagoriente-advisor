import { Link } from 'react-router-dom';
import AddIcon from 'assets/svg/Icon ADD.svg';

import classNames from 'common/utils/classNames';
import classes from './styles.module.scss';

interface AddGroupProps {
  className?: string;
}

const AddGroup = ({ className }: AddGroupProps) => (
  <Link to="/groupes/create" className={classNames(classes.add, className)}>
    <img className={classes.icon} src={AddIcon} alt="" />
    ajouter un groupe
  </Link>
);

export default AddGroup;
