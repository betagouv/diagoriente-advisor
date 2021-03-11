import { useState, useEffect, useContext } from 'react';
import { useResendEmailActivation } from 'common/requests/user';
import userContext from 'common/contexts/UserContext';
import classesNames from 'common/utils/classNames';
import ModalContainer from 'components/Modal/Modal';
import localforage from 'localforage';
import Button from 'components/Button/Button';
import Title from 'components/Title/Title';
import classes from './bandeau.module.scss';

interface IProps {
  warningMessage?: boolean;
  img?: string;
  title: string;
  description: string;
  data?: number[] | null;
}
const getToken = async () => {
  const token: string | null = await localforage.getItem('auth');
  const parsedToken = token ? JSON.parse(token) : '';
  return parsedToken.token.accessToken;
};

const Bandeau = ({ warningMessage, img, title, description, data }: IProps) => {
  const { user } = useContext(userContext);
  const [onUpdateCall, onUpdateState] = useResendEmailActivation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (onUpdateState.data) {
      setOpen(true);
    }
  }, [onUpdateState.data]);

  const onClickSend = async () => {
    if (user) {
      const token = await getToken();
      if (token) onUpdateCall({ variables: { token } });
    }
  };

  const textData = ['Nouveaux parcours', 'Nouvelles expériences', 'Nouveaux métiers'];
  const empty = data?.every((e) => e === 0);
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.info_container_text}>
          <span className={classes.title_bandeau}>{title}</span>
          {!warningMessage && (
            <div className={classes.infoDataContainer}>
              <div
                className={classesNames(!empty ? classes.infoDataContainerText : classes.infoDataContainerTextEmpty)}
              >
                <p className={classes.info_description}>{description}</p>
              </div>
            </div>
          )}
          {warningMessage && (
            <div className={classes.warningContainer}>
              <p className={classes.warning}>
                Un e-mail a été envoyé a votre boite de réception. Si vous n&apos;avez pas reçu de mail, veuillez
                cliquer ici pour envoyer un nouvel e-mail de vérification !
              </p>
              <Button label="Envoyer" onClick={onClickSend} disable={onUpdateState.loading} className={classes.btn} />
            </div>
          )}
        </div>
        {!warningMessage && !empty && (
          <div className={classes.statContainer}>
            {data?.map((d, i) => (
              <div className={classes.info} key={`${d + textData[i]}`}>
                <span className={classes.titleInfo}>{d}</span>
                <p className={classes.descriptionInfo}>{textData[i]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={classes.image_wrapper_bandeau}>
        <div className={classes.image_container_bandeau}>
          <img alt="img_bandeau" src={img} />
        </div>
      </div>
      <ModalContainer isOpen={open} onClose={() => setOpen(false)} className={classes.modal_confirmation}>
        <>
          <div className={classes.titleModal}>
            <Title title="Activez votre compte" />
          </div>
          <div className={classes.modalBody}>
            <p className={classes.text_confirmation}>Un email à été renvoyer à votre boite de réception</p>
            <div className={classes.btn_container}>
              <Button label="Fermer" outlined onClick={() => setOpen(false)} className={classes.btn_style} />
            </div>
          </div>
        </>
      </ModalContainer>
    </div>
  );
};

export default Bandeau;
