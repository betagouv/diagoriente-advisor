import { Link } from 'react-router-dom';
import { useReferences } from 'common/requests/reference';

const Reference = () => {
  const { data } = useReferences();

  if (!data) return <div />;

  return (
    <div>
      {/* changer link et ajouter le logic du button */}
      <Link to="/reference/add">Créer une déclinaison</Link>
      {data.references.data.length ? (
        data.references.data.map((ref) => <div key={ref.id}>{ref.title}</div>)
      ) : (
        <div>Empty data</div>
      )}
    </div>
  );
};

export default Reference;
