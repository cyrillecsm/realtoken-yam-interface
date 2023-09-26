import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ColumnDef } from '@tanstack/react-table';

import { useAtomValue } from 'jotai';

import { tableOfferTypeAtom } from 'src/states';
import { OFFER_TYPE, Offer } from 'src/types/offer';

import {
  accountOfferActionsColumn,
  amountColumn,
  buyShortTokenNameColumn,
  buyerTokenNameColumn,
  electricityPriceColumn,
  exchangeBuyShortTokenNameColumn,
  exchangeOfferShortTokenNameColumn,
  header,
  idColumn,
  miningSiteColumn,
  offerShortTokenNameColumn,
  offerTokenNameColumn,
  officialPriceColumn,
  priceColumn,
  priceDeltaColumn,
  publicActionsColumn,
  sellDateColumn,
  sellerName,
  simplePriceColumn,
} from './column';

export enum OFFERS_TYPE {
  PUBLIC,
  ADDRESS,
  PRIVATE,
}

type UseRightTableColumn = (offersType: OFFERS_TYPE) => ColumnDef<Offer>[];
export const useRightTableColumn: UseRightTableColumn = (offersType) => {
  const tableOfferType = useAtomValue(tableOfferTypeAtom);

  const { t } = useTranslation('buy', { keyPrefix: 'table' });

  // COLUMN BASE
  const basicSellColumns = useMemo(
    () => [
      idColumn(t, 1),
      offerShortTokenNameColumn(t, 2),
      buyerTokenNameColumn(t, 2),
      sellDateColumn(t, 1),
      sellerName(t, 1),
      miningSiteColumn(t, 1),
      electricityPriceColumn(t, 1),
      officialPriceColumn(t, 1),
      priceColumn(t, 1),
      priceDeltaColumn(t, 1),
      amountColumn(t, 1),
    ],
    [t]
  );
  const basicBuyColumns = useMemo(
    () => [
      idColumn(t, 1),
      offerTokenNameColumn(t, 2),
      buyShortTokenNameColumn(t, 2),
      sellDateColumn(t, 1),
      officialPriceColumn(t, 1),
      priceColumn(t, 2),
      priceDeltaColumn(t, 1),
      amountColumn(t, 2),
    ],
    [t]
  );
  const basicExchangeColumns = useMemo(
    () => [
      idColumn(t, 1),
      exchangeOfferShortTokenNameColumn(t, 2),
      exchangeBuyShortTokenNameColumn(t, 2),
      simplePriceColumn(t, 2),
      amountColumn(t, 2),
    ],
    [t]
  );

  // OFFER PUBLIC
  const sellPublicColumns = useMemo(
    () => [
      {
        id: 'title',
        header: () => header({ title: t('title') }),
        meta: { colSpan: 13 },
        columns: [...basicSellColumns, publicActionsColumn(t, 1)],
      },
    ],
    [basicSellColumns, t]
  );
  const buyPublicColumns = useMemo(
    () => [
      {
        id: 'title',
        header: () => header({ title: t('title') }),
        meta: { colSpan: 15 },
        columns: [...basicBuyColumns, publicActionsColumn(t, 1)],
      },
    ],
    [t, basicBuyColumns]
  );
  const exchangePublicColumn = useMemo(
    () => [
      {
        id: 'title',
        header: () => header({ title: t('title') }),
        meta: { colSpan: 11 },
        columns: [...basicExchangeColumns, publicActionsColumn(t, 1)],
      },
    ],
    [t, basicExchangeColumns]
  );

  // OFFER ADDRESS
  const sellAddressColumns = useMemo(
    () => [
      {
        id: 'title',
        header: () => header({ title: t('title') }),
        meta: { colSpan: 12 },
        columns: [...basicSellColumns, accountOfferActionsColumn(t, 1)],
      },
    ],
    [basicSellColumns, t]
  );
  const buyAddressColumns = useMemo(
    () => [
      {
        id: 'title',
        header: () => header({ title: t('title') }),
        meta: { colSpan: 14 },
        columns: [...basicBuyColumns, accountOfferActionsColumn(t, 1)],
      },
    ],
    [t, basicBuyColumns]
  );
  const exchangeAddressColumn = useMemo(
    () => [
      {
        id: 'title',
        header: () => header({ title: t('title') }),
        meta: { colSpan: 11 },
        columns: [...basicExchangeColumns, accountOfferActionsColumn(t, 1)],
      },
    ],
    [t, basicExchangeColumns]
  );

  const publicColumns = useMemo(() => {
    return new Map<OFFER_TYPE, ColumnDef<Offer>[]>([
      [OFFER_TYPE.SELL, sellPublicColumns],
      [OFFER_TYPE.BUY, buyPublicColumns],
      [OFFER_TYPE.EXCHANGE, exchangePublicColumn],
    ]);
  }, [buyPublicColumns, exchangePublicColumn, sellPublicColumns]);
  const addressColumns = useMemo(() => {
    return new Map<OFFER_TYPE, ColumnDef<Offer>[]>([
      [OFFER_TYPE.SELL, sellAddressColumns],
      [OFFER_TYPE.BUY, buyAddressColumns],
      [OFFER_TYPE.EXCHANGE, exchangeAddressColumn],
    ]);
  }, [buyAddressColumns, exchangeAddressColumn, sellAddressColumns]);

  const rightColumn: ColumnDef<Offer>[] = useMemo(() => {
    switch (offersType) {
      case OFFERS_TYPE.PUBLIC:
        const publicOffers = publicColumns.get(tableOfferType);
        return publicOffers ?? sellPublicColumns;
      case OFFERS_TYPE.ADDRESS:
        const addressOffers = addressColumns.get(tableOfferType);
        return addressOffers ?? sellAddressColumns;
      case OFFERS_TYPE.PRIVATE:
        const privateOffers = publicColumns.get(tableOfferType);
        return privateOffers ?? sellPublicColumns;
      default:
        const defaultOffers = publicColumns.get(tableOfferType);
        return defaultOffers ?? sellPublicColumns;
    }
  }, [
    addressColumns,
    offersType,
    publicColumns,
    sellAddressColumns,
    sellPublicColumns,
    tableOfferType,
  ]);

  return rightColumn;
};
