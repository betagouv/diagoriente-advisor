import React from 'react';
import classes from './title.module.scss';

interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => {
  return <div className={classes.title}>{title}</div>;
};

export default Title;
