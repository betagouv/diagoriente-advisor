import { useState } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import Select from 'components/Form/Select/Select';
import classes from './box.module.scss';

interface IProps {
  title: string;
  bigTitle: string;
  descriptopn: string;
  link: string;
  image: string;
  message: string;
  data?: any;
  filters?: string[];
  SetelectedFilter: (e: { text: string; title: string }) => void;
  selectedFilter: string;
  isActive: boolean;
}

const Box = ({
  title,
  bigTitle,
  descriptopn,
  link,
  image,
  message,
  data,
  filters,
  selectedFilter,
  isActive,
  SetelectedFilter,
}: IProps) => {
  moment.locale('fr');
  const [isOpen, setIsOpen] = useState(false);
  const onClickSelect = () => setIsOpen(!isOpen);
  const onClickItem = (e: string) => {
    SetelectedFilter({ text: e, title });
  };
  return (
    <div className={classes.box_container}>
      <div className={classes.header_box}>
        <div className={classes.title_box}>{title}</div>
        {isActive && filters && (
          <div className={classes.select_container}>
            <Select
              value={selectedFilter}
              options={filters.map((e) => ({ value: e, label: e }))}
              isOpen={isOpen}
              onClickSelect={onClickSelect}
              onClickItem={onClickItem}
              label="filter"
            />
          </div>
        )}
      </div>
      <div className={classes.content_box}>
        {data && data?.length !== 0 ? (
          data.map((e: any, i: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`${e.info.date}+${i}`} className={classes.rowInfo}>
              <img src={e.user.logo} alt="u" className={classes.logo_user} />
              <div className={classes.info_user}>
                <div className={classes.text_user}>
                  <span className={classes.text_bold}>
                    {`  ${e.user.profile.firstName} ${e.user.profile.lastName} `}
                  </span>
                  <span>{message}</span>
                  <span className={classes.text_bold}>
                    {` ${e.info.text || `${e.info.theme.type} ${e.info.theme.title}`}`}
                  </span>
                  <div>
                    <span className={classes.text_date}>
                      {moment(e.user.createdAt || e.info.date || e.info.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <p className={classes.big_title_box}>{bigTitle}</p>
            <p className={classes.description_box}>{descriptopn}</p>
            {isActive && <p className={classes.link_box}>{link}</p>}
            <img src={image} alt="d" />
          </>
        )}
      </div>
    </div>
  );
};

export default Box;
