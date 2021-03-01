import classNames from 'common/utils/classNames';
import classes from './style.module.scss';

export type Header<T> =
  | {
      title: React.ReactNode;
      key: string;
      render: (record: T, index: number) => React.ReactNode;
      dataIndex?: undefined;
    }
  | {
      title: React.ReactNode;
      key: string;
      dataIndex: keyof T;
      render?: undefined;
    };

export interface TableProps<T extends { id: string }> {
  headers: Header<T>[];
  data: T[];
  EmptyComponent?: React.ComponentType;
  onRowClick?: (row: T, index: number) => void;
  count?: number;
  classes?: {
    container?: string;
    row?: string;
    head?: string;
  };
}

function Table<T extends { id: string }>({ headers, data, EmptyComponent, onRowClick, classes: c }: TableProps<T>) {
  const classesProp = c || {};

  if (data.length === 0 && EmptyComponent) return <EmptyComponent />;

  return (
    <div className={classNames(classes.container, classesProp.container)}>
      <div className={classes.scroll}>
        <table className={classes.table}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header.key} className={classNames(classes.th, classesProp.head)}>
                  {header.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={classes.tableBody}>
            {data.map((d, index) => (
              <tr
                className={classesProp.row}
                onClick={() => {
                  if (onRowClick) onRowClick(d, index);
                }}
                key={d.id}
              >
                {headers.map((header) => (
                  <td key={header.key} className={classes.td}>
                    {header.render ? header.render(d, index) : d[header.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
