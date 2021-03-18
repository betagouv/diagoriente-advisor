import React from 'react';
import ClassNames from 'common/utils/classNames';
import classes from './title.module.scss';

interface TitleProps {
  title: string;
  className?: string;
}

const Title = ({ title, className }: TitleProps) => {
  return <div className={ClassNames(classes.title, className)}>{title}</div>;
};

export default Title;
