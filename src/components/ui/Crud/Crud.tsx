import React, { useEffect, useMemo, Ref, useCallback } from 'react';
import { MutationTuple, QueryTuple } from '@apollo/react-hooks';
import { ApolloError, LazyQueryHookOptions, QueryResult } from '@apollo/client';
import { matchPath, match as Match, useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import path from 'path';
import { decodeUri, encodeUri } from 'common/utils/url';
import { graphQLResult } from 'common/utils/graphql';

import { useError } from 'common/hooks/apollo';

import Loader from 'components/Layout/loader/loader';
import Table, { Header, TableProps } from 'components/ui/Table/Table';
import Modal from 'components/Modal/Modal';

import { isEmpty } from 'lodash';
import useCaptureRef from 'common/hooks/useCaptureRef';

import classNames from 'common/utils/classNames';
import classes from './style.module.scss';
import Pagination from '../Pagination/Pagination';

export const PER_PAGE = 7;

type MutationParams<T> = T extends MutationTuple<any, infer R> ? R : never;
type MutationReturnType<T> = T extends MutationTuple<infer R, any> ? R : never;

type LazyQueryReturnType<T> = T extends QueryTuple<infer R, any> ? R : never;

export type CreateHeaderType<T> = (calls: {
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}) => Header<T>[];
export interface ApisRef<T extends { id: string }, CR> {
  data: T[];
  list: QueryResult<any, any>;
  createState: { data: CR };
}

interface Props<
  K extends string,
  T extends { id: string },
  L extends { page?: number; perPage?: number },
  C extends MutationTuple<any, any>,
  U extends MutationTuple<any, { id: string }> | undefined[],
  G extends (options: LazyQueryHookOptions<any, { id: string }>) => QueryTuple<any, { id: string }> | undefined[],
  P extends Partial<{
    error: ApolloError;
    onSubmit: (values: MutationParams<C>) => void;
    fetching: boolean;
    data: MutationReturnType<C>;
    type: 'update' | 'create';
    get: LazyQueryReturnType<G>;
  }>
> {
  list: (
    options?: any,
  ) => QueryResult<{ [key in K]: { data: T[]; perPage: number; page: number; totalPages: number; count: number } }, L>;
  handleUri: (uri: Record<string, string>) => L;
  create: () => C;
  update: () => U;
  delete: () => MutationTuple<any, { id: string }> | undefined[];
  get: G;
  formProps: Omit<P, 'fetching' | 'data' | 'error' | 'onSubmit' | 'type' | 'get'>;
  Form?: React.ComponentType<P>;
  Filter?: React.ComponentType<{ onChange: (d: Record<string, any>) => void; initialValues: L }>;
  apisRef?: Ref<ApisRef<T, MutationReturnType<C>> | null>;
  createHeaders: CreateHeaderType<T>;
  onError: (error: string) => void;
  DeletePopup?: React.ComponentType<{ onDelete: (id: string) => void; id: string; onClose: () => void }>;
  AddComponent?: React.ComponentType<{ onClick: () => void }>;
  noPages?: boolean;
  modalProps: {
    className?: string;
    body?: string;
  };
  className?: string;
  tableProps: Partial<Pick<TableProps<T>, 'EmptyComponent' | 'onRowClick' | 'classes'>>;
  autoRedirect: boolean;
}

const Crud = <
  K extends string,
  T extends { id: string },
  L extends { page?: number; perPage?: number },
  C extends MutationTuple<any, any>,
  U extends MutationTuple<any, { id: string }> | undefined[],
  G extends (options: LazyQueryHookOptions<any, { id: string }>) => QueryTuple<any, { id: string }> | undefined[],
  P extends Partial<{
    error: ApolloError;
    onSubmit: (values: MutationParams<C>) => void;
    fetching: boolean;
    data: MutationReturnType<C>;
    type: 'update' | 'create';
    get: LazyQueryReturnType<G>;
  }>
>({
  list: useList,
  create,
  update,
  delete: remove,
  get: useGet,
  createHeaders,
  Form,
  Filter,
  formProps,
  handleUri,
  apisRef,
  onError,
  DeletePopup,
  AddComponent,
  noPages,
  tableProps,
  modalProps,
  className,
  autoRedirect,
}: Props<K, T, L, C, U, G, P>) => {
  /* ----- List current params extract ----- */
  const location = useLocation();
  const match = useRouteMatch();
  const history = useHistory();
  const uri = decodeUri(location.search);

  let querySearch = {};

  if (!noPages) {
    querySearch = { ...(handleUri(uri) as any), page: Number(uri.page) || 1, perPage: Number(PER_PAGE) || 10 };
  }

  /* ----- Requests handlers ----- */
  const list = useList({
    variables: querySearch,
    fetchPolicy: 'network-only',
  });

  const [getCall, getState] = useGet({ fetchPolicy: 'network-only' });
  const [createCall, createState] = create();
  const [updateCall, updateState] = update();
  const [deleteCall, deleteState] = remove();

  const { data, page: currentPage, totalPages } = useMemo(
    () =>
      list.data
        ? graphQLResult(list.data)
        : {
            data: [] as T[],
            page: 1,
            totalPages: 0,
            count: 0,
          },
    [list.data],
  );
  const fetching =
    list.loading ||
    (createState && createState.loading) ||
    (updateState && updateState.loading) ||
    (deleteState && deleteState.loading);

  /* ----- Table config ----- */

  useCaptureRef({ data, list, createState: createState as any }, apisRef);

  /* ----- Modal open checks ----- */
  const isCreate = matchPath(location.pathname, {
    path: `${match.path}/create`,
    exact: true,
  });
  const isUpdate: Match<{ id: string }> | null = matchPath(location.pathname, {
    path: `${match.path}/update/:id`,
    exact: true,
  });

  const isDelete: Match<{ id: string }> | null = matchPath(location.pathname, {
    path: `${match.path}/delete/:id`,
    exact: true,
  });

  useEffect(() => {
    if (autoRedirect && updateState?.data && !updateState.loading && !updateState.error) {
      list.refetch();
      const { page, ...rest } = uri;
      let search = '';
      if (!isEmpty(rest)) search = encodeUri(rest);

      history.replace({ pathname: match.url, search });
    }
    // eslint-disable-next-line
  }, [updateState?.data, updateState?.loading]);

  useEffect(() => {
    if (autoRedirect && createState?.data && !createState.loading && !createState.error) {
      if (list.data) {
        list.refetch();
      }
      history.replace(match.url);
    }
    // eslint-disable-next-line
  }, [createState?.data, createState?.loading]);

  useEffect(() => {
    if (autoRedirect && deleteState?.data && !deleteState.loading && !deleteState.error) {
      if (list.data) {
        list.refetch();
      }

      history.replace(match.url);
    }
    // eslint-disable-next-line
  }, [deleteState?.data, deleteState?.loading]);

  useEffect(() => {
    if (isUpdate && getCall) {
      getCall({ variables: { id: isUpdate.params.id } });
    }
    // eslint-disable-next-line
  }, [!!isUpdate]);

  useError(list, (e) => {
    onError(e);
  });

  useError(getState, (e) => {
    onError(e);
  });

  useError(createState, (e) => {
    onError(e);
  });

  useError(updateState, (e) => {
    onError(e);
  });

  useError(deleteState, (e) => {
    onError(e);
  });

  const onFilterChange = useCallback(
    (d) => {
      history.replace({ pathname: location.pathname, search: encodeUri(d as any) });
    },
    // eslint-disable-next-line
    [],
  );

  /* ----- Open modals functions ----- */

  function closeModal() {
    history.replace(match.url);
  }

  /* ----- Submit create or edit ----- */
  function onSubmit(values: MutationParams<C>) {
    if (isCreate && createCall) {
      createCall({ variables: values });
    } else if (isUpdate && updateCall) {
      updateCall({ variables: { id: isUpdate.params.id, ...values } });
    }
  }

  function onPageChange(nextPage: number) {
    history.replace({ pathname: location.pathname, search: encodeUri({ ...uri, page: nextPage }) });
  }

  const onUpdate = (id: string) => {
    history.push({ pathname: path.join(match.url, `/update/${id}`), search: location.search });
  };

  const onDelete = (id: string) => {
    // if delete popup passed show it or delete immediately
    if (DeletePopup) history.replace({ pathname: path.join(match.url, `/delete/${id}`), search: location.search });
    else if (deleteCall) deleteCall({ variables: { id } });
  };

  const headers = createHeaders({ onUpdate, onDelete });

  const tableClasses: typeof tableProps.classes = {
    container: classNames(classes.table, !(totalPages && !noPages) && classes.noPages),
    row: tableProps.onRowClick && classes.clickableRow,
  };
  const tableClassesProps = tableProps.classes;
  if (tableClassesProps) {
    (Object.keys(tableClassesProps) as (keyof Required<typeof tableProps>['classes'])[]).forEach((key) => {
      tableClasses[key] = tableClasses[key]
        ? classNames(tableClasses[key], tableClassesProps[key])
        : tableClassesProps[key];
    });
  }

console.log(data);
  return (
    <>
      <div className={classNames(classes.container, className)}>
        {fetching && (
          <div className={classes.loader}>
            <Loader />
          </div>
        )}

        {Filter && <Filter initialValues={handleUri(uri)} onChange={onFilterChange} />}

        {AddComponent && (
          <AddComponent
            onClick={() => history.push({ pathname: path.join(match.path, '/create'), search: location.search })}
          />
        )}

        {list.data && <Table {...tableProps} classes={tableClasses} headers={headers} data={data} />}
        {totalPages && !noPages ? (
          <Pagination
            className={classes.pagination}
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
        ) : null}
      </div>

      {Form && (
        <Modal {...modalProps} isOpen={!!isCreate} onClose={closeModal}>
          <Form
            {...(formProps as any)}
            fetching={createState ? createState.loading : false}
            data={createState ? createState.data : undefined}
            error={createState ? createState.error : undefined}
            onSubmit={onSubmit}
            type="create"
          />
        </Modal>
      )}

      {Form && getState && getState.data && (
        <Modal {...modalProps} isOpen={!!isCreate} onClose={closeModal}>
          <Form
            {...(formProps as any)}
            get={getState.data}
            type="update"
            fetching={updateState ? updateState.loading : false}
            error={updateState ? updateState.error : undefined}
            onSubmit={onSubmit}
          />
        </Modal>
      )}

      {DeletePopup && isDelete && (
        <DeletePopup
          onClose={closeModal}
          onDelete={(id) => {
            if (deleteCall) deleteCall({ variables: { id } });
          }}
          id={isDelete.params.id}
        />
      )}
    </>
  );
};

Crud.defaultProps = {
  formProps: {},
  handleUri: (data: Record<string, string>) => data,
  onError: () => {},
  create: () => [],
  update: () => [],
  delete: () => [],
  get: () => [],
  EmptyComponent: () => 'Empty',
  modalProps: {},
  tableProps: {},
  autoRedirect: true,
};

export default Crud;
