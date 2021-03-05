import { useEffect, useMemo, useState } from 'react';
import { useLazyGroups } from 'common/requests/groupes';
import classNames from 'common/utils/classNames';
import SearchInput from 'components/Form/SearchInput/SearchInput';
import Select from 'components/Form/Select/Select';

import classes from './styles.module.scss';

const selectClasses = {
  container: classes.select,
  options: classes.selectOptions,
  option: classes.selectOption,
};

interface ParcourFilterProps {
  onChange: (filter: { completed?: string; code?: string; search?: string }) => void;
  initialValues: { completed?: boolean; code?: string; search?: string };
}

const ParcourFilter = ({ onChange, initialValues }: ParcourFilterProps) => {
  let initialCompleted = '';
  if (typeof initialValues.completed === 'boolean') {
    initialCompleted = initialValues.completed ? 'true' : 'false';
  }
  const [groupCall, { data }] = useLazyGroups();
  const [search, setSearch] = useState(initialValues.search || '');
  const [code, setCode] = useState(initialValues.code || '');
  const [completed, setCompleted] = useState(initialCompleted);

  useEffect(() => {
    groupCall();
    // eslint-disable-next-line
  }, []);

  const handleChange = () => {
    const filter: { completed?: string; code?: string; search?: string } = {};
    if (completed) {
      filter.completed = completed;
    }
    if (code) {
      filter.code = code;
    }
    if (search) filter.search = search;
    onChange(filter);
  };

  useEffect(() => {
    handleChange();
    // eslint-disable-next-line
  }, [code, completed]);

  const groupes = useMemo(() => {
    if (!data) return [];
    return data.groupes.data.map((group) => ({ label: group.title, value: group.code }));
  }, [data]);

  return (
    <div className={classNames(classes.row, classes.container)}>
      <div className={classes.row}>
        <h1 className={classes.title}>Parcours</h1>
        <SearchInput
          onSearch={handleChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleChange();
            }
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Recherche"
        />
      </div>
      <div className={classes.row}>
        <Select
          classes={selectClasses}
          onClickItem={(e) => setCode(e)}
          options={[{ value: '', label: 'Tous les groupes' }, ...groupes]}
          value={code}
          label="Tous les groupes"
        />
        <Select
          classes={selectClasses}
          onClickItem={(e) => setCompleted(e)}
          options={[
            { value: '', label: 'Tous les états' },
            { value: 'true', label: 'Complété' },
            { value: 'false', label: 'Non complété' },
          ]}
          value={completed}
          label="Tous les états"
        />
      </div>
    </div>
  );
};

export default ParcourFilter;
