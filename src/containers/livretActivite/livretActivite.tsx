/* eslint-disable max-len */
import Card from 'components/Card/Card';
import React from 'react';
import download from 'assets/svg/download.svg';
import print from 'assets/svg/print.svg';
import Title from 'components/Title/Title';
import style from './style.module.scss';

const firstCard = [
  {
    id: 1,
    title: "Le livret d'activités complet ",
    text:
      "pour découvrir tous les formats d'ateliers adaptés à differents contextes d'usage et de pratique (présentiel,distanciel, formats hybrides).",
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Livret-dactivites-Diagoriente.pdf',
  },

  {
    id: 2,
    title: 'Les fonctionnalités',
    text: 'pour faire un tour d’horizon des possibilités qu’offre Diagoriente.',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/2-Fonctionnalites-espace-pro.pdf',
  },
  {
    id: 3,
    title: " L'atelier focus orientation",
    text:
      'pour accompagner vos publics en présentiel dans la seconde étape (exploration des intérêts pro et des pistes métiers, recherche d’immersion géolocalisée).',

    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/4-Focus-orientation.pdf',
  },
  {
    id: 4,
    title: " L'atelier en distanciel",
    text: 'pour accompagner vos publics à distance dans l’intégralité du parcours.',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Format-distanciel.pdf',
  },
];
const secondCard = [
  {
    id: 5,
    title: 'Le cadre théorique ',
    text: 'pour comprendre le concept et étayer les pratiques du dispositif.',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/1-Avant-propos-cadre-theorique.pdf',
  },
  {
    id: 6,
    title: "L'atelier focus bilan ",
    text:
      ' pour accompagner vos publics en présentiel dans la première étape de diagnostic (introduction et complétion de la carte de compétences).',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/3-Focus-bilan.pdf',
  },
  {
    id: 7,
    title: "L'atelier combiné focus bilan et orientation",

    text: 'pour accompagner vos publics en présentiel dans l’intégralité du parcours.',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/5-Presentiel-focus-bilan-et-orientation.pdf',
  },
  {
    id: 8,
    title: 'Les ateliers hybrides ',
    text:
      'pour accompagner en mix présentiel/distanciel vos publics scolarisés (Prépa Apprentissage) ou en dispositif d’insertion (Mission Locale, E2C...).',

    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Formats-hybrides.pdf',
  },
];
const annex = [
  {
    id: 9,
    text: 'Guide utilisateur Diagoriente en distanciel',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Annexes/Guide-utilisateur-distanciel.pdf',
  },
  {
    id: 10,
    text: 'Référentiel RECTEC',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Annexes/Referentiel-RECTEC.pdf',
  },
  {
    id: 11,
    text: 'Référentiel RECTEC Engagement',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Annexes/Referentiel-RECTEC-Engagement.pdf',
  },
  {
    id: 12,
    text: 'Jeu de cartes - plateau',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Annexes/Jeu-de-cartes-plateau.pdf',
  },
  {
    id: 13,
    text: 'Jeu de cartes - cartes à découper',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Annexes/Jeu-de-cartes cartes-decouper.pdf',
  },
  {
    id: 14,
    text: 'Jeu de cartes engagement - plateau',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Annexes/Jeu-de-cartes-Engagement-plateau.pdf',
  },
  {
    id: 15,
    text: 'Jeu de cartes engagement - cartes à découper ',
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Annexes/Jeu-de-cartes-Engagement-cartes-découper.pdf',
  },
  {
    id: 16,
    text: "Fiche support entretien d'explicitation ",
    link: 'https://diagoriente.beta.gouv.fr/activite-advisor/Annexes/Fiche-support-entretien-explicitation.pdf',
  },
];
const LivretActiviteContainer = () => {
  return (
    <div className={style.layout}>
      <Title title="Ressources" />
      <div className={style.livretActiviteContainer}>
        <div className={style.headerContainer}>
          <div className={style.titleContainer}>Téléchargez</div>
          <div className={style.CardContainer}>
            <div className={style.Card}>
              {firstCard.map((i) => (
                <Card logoLink={i.link} textCard={i.text} logo={download} backColor="#F5F6FB" titleCard={i.title} />
              ))}
            </div>
            <div className={style.Card}>
              {secondCard.map((i) => (
                <Card logoLink={i.link} textCard={i.text} logo={download} backColor="#F5F6FB" titleCard={i.title} />
              ))}
            </div>
          </div>
        </div>
        <div className={style.footerContainer}>
          <div className={style.titleContainer}>Annexes à imprimer </div>
          <div className={style.cardFooterContainer}>
            {annex.map((i) => (
              <Card textCard={i.text} logo={print} backColor="#FFFFFF" className={style.cardItem} logoLink={i.link} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivretActiviteContainer;
