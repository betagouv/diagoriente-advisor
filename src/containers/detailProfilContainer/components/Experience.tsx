import moment from 'moment';
import recommendation from 'assets/svg/recommendation.svg';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import style from './experience.module.scss';
import TitleRow from './Title';

interface Props {
  data?: {
    id: string;
    title: string;
    description: string[];
    createdAt: string;
    comment?: {
      id: string;
      lastName: string;
      firstName: string;
      commentText: string;
      status: 'pending' | 'accepted' | 'refused';
      email: string;
      institution: string;
      location: string;
    }[];
  }[];
  title: string;
}
const format = 'MMM YYYY';

const Experience = ({ data, title }: Props) => {
  return (
    <div className={style.container}>
      {data?.length ? <div className={style.title}>{title}</div> : null}

      {data?.map((j) => {
        return (
          <>
            <div key={j.id} className={style.row}>
              <TitleRow title={j.title} date={moment(j.createdAt).format(format)} />
              {j.comment?.map((c) => (
                <div className={style.recommendation}>
                  <img className={style.icon} src={recommendation} alt="" />
                  <Tooltip
                    overlayClassName={style.tooltip}
                    placement="bottom"
                    overlay={c.commentText}
                    arrowContent={<div className="rc-tooltip-arrow-inner" />}
                  >
                    <span className={style.text}>{`Recommandé par ${c.firstName} ${c.lastName}`}</span>
                  </Tooltip>
                </div>
              ))}
              <div className={style.description}>
                {j.description.map((description) => (
                  <div className={style.descriptionContent}>{description}</div>
                ))}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Experience;
