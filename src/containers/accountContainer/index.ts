import createLazyComponent from 'utils/createLazyComponent';

export default createLazyComponent(() => import('./accountContainer'));
