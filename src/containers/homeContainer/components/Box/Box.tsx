import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import Select from 'components/Form/Select/Select';
import { useHistory } from 'react-router-dom';
import useOnclickOutside from 'common/hooks/useOnclickOutside';
import classes from './box.module.scss';

interface IProps {
  title: string;
  bigTitle: string;
  descriptopn: string;
  link: string;
  image: string;
  message: string;
  data?: any;
  slicedData?: any;
  filters?: string[];
  SetelectedFilter: (e: { text: string; title: string }) => void;
  selectedFilter: string;
  isActive: boolean;
  isEmpty?: boolean;
}

const Box = ({
  title,
  bigTitle,
  descriptopn,
  link,
  image,
  message,
  data,
  slicedData,
  filters,
  selectedFilter,
  isActive,
  isEmpty,
  SetelectedFilter,
}: IProps) => {
  moment.locale('fr');

  const [isOpen, setIsOpen] = useState(false);
  const [seeAllParc, setSeeAllParc] = useState(false);
  const [seeAllExp, setSeeAllExp] = useState(false);
  const [seeAllRech, setSeeAllRech] = useState(false);
  const [disData, setDisData] = useState([]);
  const refSelect = useRef<HTMLDivElement>(null);
  useOnclickOutside(refSelect, () => setIsOpen(false));
  const onClickSelect = () => setIsOpen(!isOpen);
  const history = useHistory();
  const onClickItem = (e: string) => {
    SetelectedFilter({ text: e, title });
  };
  const onClickLink = (l: string) => {
    if (l === 'Envoyez des invitations') history.push(`/groupes`);
  };
  const traduireType = (text: string) => {
    let res: string = '';
    switch (text) {
      case 'professional':
        res = 'professionnelle';
        break;
      case 'personal':
        res = 'personnelle';
        break;
      case 'sport':
        res = 'sportive';
        break;
      default: {
        res = 'engagement';
      }
    }
    return res;
  };
  const onClickSeeAll = () => {
    if (title === 'Parcours') setSeeAllParc(true);
    else if (title === 'Expériences') setSeeAllExp(true);
    else if (title === 'Recherches') setSeeAllRech(true);
  };
  useEffect(() => {
    if (title === 'Parcours')
      if (seeAllParc) setDisData(data);
      else setDisData(slicedData);
  }, [title, data, seeAllParc, slicedData]);
  useEffect(() => {
    if (title === 'Expériences')
      if (seeAllExp) setDisData(data);
      else setDisData(slicedData);
  }, [title, data, seeAllExp, slicedData]);
  useEffect(() => {
    if (title === 'Recherches')
      if (seeAllRech) setDisData(data);
      else setDisData(slicedData);
  }, [title, data, seeAllRech, slicedData]);

  return (
    <div className={classes.box_container}>
      <div className={classes.header_box} style={{ justifyContent: title === 'Parcours' ? 'flex-start' : '' }}>
        <div className={classes.title_box}>{title}</div>

        {isActive && filters && data.length >= 0 && !isEmpty && (
          <div className={classes.select_container} ref={refSelect}>
            <Select
              value={selectedFilter}
              options={filters.map((e) => ({ value: e, label: e }))}
              isOpen={isOpen}
              onClickSelect={onClickSelect}
              onClickItem={onClickItem}
              label="filtre"
            />
          </div>
        )}
      </div>
      <div className={classes.content_box}>
        {disData && disData?.length !== 0 ? (
          disData.map((e: any, i: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`${e.info.date}+${i}`} className={classes.rowInfo}>
              <img src={e.user.logo} alt="u" className={classes.logo_user} />
              <div className={classes.info_user}>
                <div className={classes.text_user}>
                  <span className={classes.text_bold_cur} onClick={() => history.push(`/parcours/${e.user.id}`)}>
                    {`  ${e.user.profile.firstName} ${e.user.profile.lastName} `}
                  </span>
                  <span>{message}</span>
                  <span className={classes.text_bold}>
                    {` ${e.info.text || `${traduireType(e.info.theme.type)} ${e.info.theme.title}`}`}
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
            {isActive && (
              <p className={classes.link_box} onClick={() => onClickLink(link)}>
                {link}
              </p>
            )}
            <img src={image} alt="d" />
          </>
        )}
      </div>
      {disData &&
        disData?.length !== 0 &&
        slicedData.length === 6 &&
        ((title === 'Parcours' && !seeAllParc) ||
          (title === 'Expériences' && !seeAllExp) ||
          (title === 'Recherches' && !seeAllRech)) && (
          <div className={classes.button_box}>
            <div className={classes.seeAll} onClick={onClickSeeAll}>
              voir tout
            </div>
          </div>
        )}
    </div>
  );
};

export default Box;
