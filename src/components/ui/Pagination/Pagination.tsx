import ArrowLeft from 'assets/svg/arrow-left.svg';
import ArrowRight from 'assets/svg/arrow-right.svg';
import ArrowLast from 'assets/svg/arrow-last.svg';
import classNames from 'common/utils/classNames';

import classes from './style.module.scss';

const NUMBER_OF_PAGES = 3;

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
  const pages = [];
  if (totalPages <= NUMBER_OF_PAGES) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
  } else {
    let leftSide = Math.ceil(NUMBER_OF_PAGES / 2);
    let rightSide = NUMBER_OF_PAGES - leftSide;

    if (currentPage > totalPages - Math.trunc(NUMBER_OF_PAGES / 2)) {
      rightSide = totalPages - currentPage;
      leftSide = NUMBER_OF_PAGES - rightSide;
    } else if (currentPage < leftSide) {
      leftSide = currentPage;
      rightSide = NUMBER_OF_PAGES - leftSide;
    }
    for (let i = leftSide - 1; i >= 0; i -= 1) {
      pages.push(currentPage - i);
    }
    for (let i = 1; i <= rightSide; i += 1) {
      pages.push(currentPage + i);
    }
  }

  const renderPage = (page: number) => {
    function onClick() {
      if (page !== currentPage) {
        onPageChange(page);
      }
    }
    return (
      <div
        onClick={onClick}
        key={page}
        className={classNames(classes.page, page === currentPage && classes.pageSelected)}
      >
        {page}
      </div>
    );
  };

  const RenderArrow = (direction: 'left' | 'right') => {
    function onClick() {
      if ((currentPage !== 1 && direction === 'left') || (currentPage !== totalPages && direction === 'right')) {
        const nextPage = direction === 'left' ? currentPage - 1 : currentPage + 1;
        onPageChange(nextPage);
      }
    }

    const arrow = direction === 'left' ? ArrowLeft : ArrowRight;
    const arrowClassName = direction === 'left' ? classes.arrowLeft : classes.arrowRight;

    return (
      <span className={classNames(classes.arrow, arrowClassName)} onClick={onClick}>
        <img alt="" src={arrow} height={18} width={18} />
      </span>
    );
  };

  return (
    <div className={classNames(classes.container, className)}>
      <span
        className={classNames(classes.arrow, classes.arrowFirst)}
        onClick={() => {
          onPageChange(1);
        }}
      >
        <img alt="" src={ArrowLast} height={26} width={26} />
      </span>
      {totalPages > 1 && RenderArrow('left')}
      <div className={classes.pages}>{pages.map(renderPage)}</div>
      {totalPages > 1 && RenderArrow('right')}
      <span
        className={classNames(classes.arrow, classes.arrowLast)}
        onClick={() => {
          onPageChange(totalPages);
        }}
      >
        <img alt="" src={ArrowLast} height={26} width={26} />
      </span>
    </div>
  );
};

export default Pagination;
