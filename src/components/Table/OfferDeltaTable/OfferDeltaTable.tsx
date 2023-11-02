import { Skeleton, Text, createStyles } from '@mantine/core';

import { OFFER_TYPE, Offer } from 'src/types/offer';
import { calcRem } from 'src/utils/style';

const useStyle = createStyles((theme) => ({
  table: {
    width: '100%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    padding: 0,
    borderSpacing: 0,
    fontSize: '12px',
  },
  tableHead: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
    color: 'black',
  },
  tableCell: {
    padding: calcRem(5),
    textAlign: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}));

interface OfferDeltaTableProps {
  offer: Offer;
  officialPrice: number | undefined;
  officialYield: number | undefined;
  offerPrice: number | undefined;
  offerYield: number | undefined;
}
export const OfferDeltaTable = ({
  offer,
  officialPrice,
  officialYield,
  offerPrice,
  offerYield,
}: OfferDeltaTableProps) => {
  const { classes } = useStyle();

  return (
    <table className={classes.table}>
      <thead className={classes.tableHead}>
        <tr>
          <th className={classes.tableCell}></th>
          <th className={classes.tableCell}>{'Original'}</th>
          {offer.type !== OFFER_TYPE.EXCHANGE ? (
            <th className={classes.tableCell}>{'Offer'}</th>
          ) : undefined}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={classes.tableCell}>{'Yield'}</td>
          <td className={classes.tableCell}>
            {officialYield ? (
              `${officialYield.toFixed(2)}%`
            ) : (
              <Skeleton height={15} />
            )}
          </td>
          {offer.type !== OFFER_TYPE.EXCHANGE ? (
            <td className={classes.tableCell}>
              {offerYield ? (
                <Text>{`${offerYield.toFixed(2)}%`}</Text>
              ) : (
                <Skeleton height={15} />
              )}
            </td>
          ) : undefined}
        </tr>
        <tr>
          <td className={classes.tableCell}>{'Price'}</td>
          <td className={classes.tableCell}>
            {officialPrice ? officialPrice : <Skeleton height={15} />}
          </td>
          {offer.type !== OFFER_TYPE.EXCHANGE ? (
            <td className={classes.tableCell}>
              {offerPrice !== undefined ? (
                `${offerPrice}`
              ) : (
                <Skeleton height={15} />
              )}
            </td>
          ) : undefined}
        </tr>
      </tbody>
    </table>
  );
};
