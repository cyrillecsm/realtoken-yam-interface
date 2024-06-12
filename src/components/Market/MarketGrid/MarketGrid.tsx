import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ActionIcon,
  Flex,
  Grid,
  Group,
  MediaQuery,
  Menu,
  Pagination,
  Select,
} from '@mantine/core';
import { range, useDisclosure } from '@mantine/hooks';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';

import { useAtomValue } from 'jotai';

import { useFilterOffers } from 'src/hooks/offers/useFilterOffers';
import { useAppSelector } from 'src/hooks/react-hooks';
import { useFilter } from 'src/hooks/useFilter';
import { nameFilterValueAtom } from 'src/states';
import { selectPublicOffers } from 'src/store/features/interface/interfaceSelector';
import { Offer } from 'src/types/offer';

import { styles } from '../../Table/TableCaption/TableCaption.styles';
import { GridPane } from './GridPane';

export const MarketGrid: FC = () => {
  const publicOffers = useAppSelector(selectPublicOffers);
  const { offers } = useFilterOffers(publicOffers);

  const [data, setData] = useState<string[]>(['9', '18', '36', '72']);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(parseInt(data[2]));

  const paginationProps = {
    total: Math.ceil(offers.length / pageSize),
    page: page,
    radius: 'md',
    size: 'md',
    siblings: 0,
    onChange: (page: number) => setPage(page),
  };

  const [isOpen, handlers] = useDisclosure(false);
  const { t } = useTranslation('table', { keyPrefix: 'caption' });

  const nameFilterValue = useAtomValue(nameFilterValueAtom);
  const { filteredDatas } = useFilter(nameFilterValue, offers);

  const paginationOffers: Offer[] = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredDatas ? filteredDatas.slice(start, end) : [];
  }, [filteredDatas, page, pageSize]);

  return (
    <Flex gap={'md'} direction={'column'} align={'center'}>
      <Grid gutterMd={25} style={{ width: '100%' }}>
        {offers.length > 0
          ? paginationOffers.map((offer: Offer, index: number) => (
              <Grid.Col sm={6} md={4} lg={3} key={`grid-${index}`}>
                <GridPane offer={offer} />
              </Grid.Col>
            ))
          : // TODO: add message when no offers
            undefined}
      </Grid>
      <Group
        position={'center'}
        align={'center'}
        spacing={8}
        p={'sm'}
        sx={styles.caption}
        style={{ width: '100%' }}
      >
        <MediaQuery smallerThan={'xs'} styles={{ display: 'none' }}>
          <Pagination {...paginationProps} boundaries={1} />
        </MediaQuery>

        <MediaQuery largerThan={'xs'} styles={{ display: 'none' }}>
          <Pagination {...paginationProps} boundaries={0} />
        </MediaQuery>

        <Menu
          position={'top'}
          closeOnItemClick={false}
          opened={isOpen}
          onOpen={handlers.open}
          onClose={handlers.close}
        >
          <Menu.Target>
            <ActionIcon size={32} color={'brand'}>
              <IconAdjustmentsHorizontal size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label pb={0}>{t('lineNumber')}</Menu.Label>
            <Select
              p={5}
              searchable={true}
              creatable={true}
              getCreateLabel={(value) =>
                Number.isInteger(Number(value)) &&
                Number(value) > 0 &&
                Number(value) <= 500
                  ? value
                  : null
              }
              onCreate={(newData) => {
                setData((current) => [...current, newData]);
                return { value: newData };
              }}
              nothingFound={t('noOption')}
              value={pageSize.toString()}
              onChange={(value) => setPageSize(Number(value))}
              data={data}
            />
            <Menu.Label pb={0}>{t('goTo')}</Menu.Label>
            <Select
              p={5}
              searchable={true}
              nothingFound={t('noOption')}
              value={paginationProps.page?.toString()}
              onChange={(value) => paginationProps.onChange!(Number(value))}
              data={[
                ...range(1, paginationProps.total).map((idx) => idx.toString()),
              ]}
            />
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Flex>
  );
};
