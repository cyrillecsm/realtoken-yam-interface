import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActionIcon, Group, MantineSize, Text, Title } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useOffers } from 'src/hooks';
import { Offer } from 'src/hooks/types';

import { Table } from '../../Table';
import { BuyActionsWithPermit } from '../BuyActions';
import { MarketSubRow } from '../MarketSubRow';
import { useAtom } from 'jotai';
import { nameFilterValueAtom } from 'src/states';
import React from 'react';

export const MarketTable: FC = () => {
  const { offers, refreshState } = useOffers(false, false, true);

  // console.count("TES2")

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'offerId', desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const { t } = useTranslation('buy', { keyPrefix: 'table' });

  const columns = useMemo<ColumnDef<Offer>[]>(
    () => [
      {
        id: 'title',
        header: () => (
          <Title order={4} style={{ textAlign: 'center' }}>
            {t('title')}
          </Title>
        ),
        meta: { colSpan: 15 },
        columns: [
          {
            id: 'offerId',
            accessorKey: 'offerId',
            header: t('offerId'),
            cell: ({ row, getValue }) => { 
              return (
                <Group noWrap={true} spacing={'xs'}>
                  { row.original.hasPropertyToken ? 
                    <ActionIcon
                      variant={'transparent'}
                      color={'brand'}
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getIsExpanded() ? (
                        <IconChevronUp size={16} />
                      ) : (
                        <IconChevronDown size={16} />
                      )}
                    </ActionIcon>
                    :
                    <ActionIcon variant={'transparent'} color={'brand'} disabled={true}/>
                  }
                  <Text
                      size={'sm'}
                      sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {getValue()}
                    </Text>
                </Group>
              )
            },
            enableSorting: true,
            meta: { colSpan: 2 },
          },
          {
            id: 'offerTokenName',
            accessorKey: 'offerTokenName',
            header: t('offerTokenName'),
            cell: ({ getValue }) => (
              <Group noWrap={true} spacing={'xs'}>
                <Text
                  size={'sm'}
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {getValue()}
                </Text>
              </Group>
            ),
            enableSorting: true,
            meta: { colSpan: 2 },
          },
          {
            id: 'buyerTokenName',
            accessorKey: 'buyerTokenName',
            header: t('buyerTokenName'),
            cell: ({ getValue }) => (
              <Group noWrap={true} spacing={'xs'}>
                <Text
                  size={'sm'}
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {getValue()}
                </Text>
              </Group>
            ),
            enableSorting: true,
            meta: { colSpan: 2 },
          },
          {
            id: 'sellerAddress',
            accessorKey: 'sellerAddress',
            header: t('sellerAddress'),
            cell: ({ getValue }) => (
              <Group noWrap={true} spacing={'xs'}>
                <Text
                  size={'sm'}
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {getValue()}
                </Text>
              </Group>
            ),
            enableSorting: true,
            meta: { colSpan: 4 },
          },
          {
            id: 'price',
            accessorKey: 'price',
            header: t('price'),
            cell: ({ getValue }) => (
              <Text
                size={'sm'}
                sx={{
                  textAlign: 'center',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {getValue()}
              </Text>
            ),
            enableSorting: true,
            meta: { colSpan: 2 },
          },
          {
            id: 'amount',
            accessorKey: 'amount',
            header: t('amount'),
            cell: ({ getValue }) => (
              <Text
                size={'sm'}
                sx={{
                  textAlign: 'center',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {getValue()}
              </Text>
            ),
            enableSorting: true,
            meta: { colSpan: 2 },
          },
          {
            id: 'actions',
            header: undefined,
            cell: ({ row }) => (
              <BuyActionsWithPermit
                buyOffer={row.original}
                triggerRefresh={refreshState[1]}
              />
            ),
            meta: { colSpan: 1 },
          },
        ],
      },
    ],
    [refreshState, t]
  );

  const [nameFilterValue,setNamefilterValue] = useAtom(nameFilterValueAtom);

  const table = useReactTable({
    data: offers,
    columns: columns,
    state: { sorting: sorting, pagination: pagination, expanded: expanded, globalFilter: nameFilterValue },
    globalFilterFn: 'includesString',
    onSortingChange: setSorting,
    onGlobalFilterChange: setNamefilterValue,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: { colSpan: 15 },
  });

  return (
    <Table
      tableProps={{
        highlightOnHover: true,
        verticalSpacing: 'sm',
        horizontalSpacing: 'xs',
        sx: (theme) => ({
          tableLayout: 'fixed',
          border: theme.other.border(theme),
          borderRadius: theme.radius[theme.defaultRadius as MantineSize],
          borderCollapse: 'separate',
          borderSpacing: 0,
        }),
      }}
      table={table}
      tablecaptionOptions={{ refreshState: refreshState, visible: true }}
      TableSubRow={MarketSubRow}
    />
  );
};