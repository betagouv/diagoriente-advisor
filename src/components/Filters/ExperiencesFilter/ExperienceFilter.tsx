import { useEffect, useMemo, useState } from 'react';
import { useLazyGroups } from 'common/requests/groupes';
import classNames from 'common/utils/classNames';
import SearchInput from 'components/Form/SearchInput/SearchInput';
import Select from 'components/Form/Select/Select';
import Title from 'components/Title/Title';

import classes from '../ParcourFilter/styles.module.scss';

/* const selectClasses = {
  container: classes.select,
  options: classes.selectOptions,
  option: classes.selectOption,
}; */
const selectClassesGroupe = {
  options: classes.selectOptionsGroupe,
  option: classes.selectOption,
  container: classes.select,
};
interface ExperienceFilterProps {
  onChange: (filter: { code?: string; search?: string; page?: number; perPage?: number }) => void;
  initialValues: { code?: string; search?: string; page?: number; perPage?: number };
}

const ExperienceFilter = ({ onChange, initialValues }: ExperienceFilterProps) => {
  const [groupCall, { data }] = useLazyGroups();
  const [search, setSearch] = useState(initialValues.search || '');
  const [code, setCode] = useState(initialValues.code || '');

  useEffect(() => {
    groupCall();
    // eslint-disable-next-line
  }, []);

  const handleChange = () => {
    const filter: { code?: string; search?: string } = {};
    if (code) {
      filter.code = code;
    }
    if (search) filter.search = search;
    onChange(filter);
  };
  useEffect(() => {
    if (search === '') handleChange();
    if (code === '') handleChange();
    // eslint-disable-next-line
  }, [search, code]);
  useEffect(() => {
    if (code) {
      onChange({ search, code });
    }
    // eslint-disable-next-line
  }, [code]);

  const groupes = useMemo(() => {
    if (!data) return [];
    return data.groupes.data.map((group) => ({ label: group.title, value: group.code }));
  }, [data]);

  return (
    <div className={classNames(classes.row, classes.container)}>
      <div className={classes.row}>
        <Title title="Mes expériences" className={classes.titlePage} />
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
          classes={selectClassesGroupe}
          onClickItem={(e) => setCode(e)}
          options={[{ value: '', label: 'Tous les groupes' }, ...groupes]}
          value={code}
          label="Tous les groupes"
        />
        {/*   <Select
          classes={selectClasses}
          onClickItem={(e) => setCompleted(e)}
          options={[
            { value: '', label: 'Tous les états' },
            { value: 'true', label: 'Complété' },
            { value: 'false', label: 'Non complété' },
          ]}
          value={completed}
          label="Tous les états"
        /> */}
      </div>
    </div>
  );
};

export default ExperienceFilter;
