import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { SimpleGrid } from '@mantine/core';

import { useAppSelector } from 'src/hooks/react-hooks';
import { useRefreshTransactions } from 'src/hooks/transactions/useRefreshTransactions';
import { usePropertiesToken } from 'src/hooks/usePropertiesToken';
import { selectAllTransactions } from 'src/store/features/interface/interfaceSelector';
import { selectOffersIsLoading } from 'src/store/features/interface/interfaceSelector';
import { Transaction } from 'src/types/transaction/Transaction';

import { sortTransactions } from './Utils';
import { TokenStatsCard } from './components/TokenStatsCard';

export const TransactionStatsGrid = ({}) => {
  console.log('YamTransactionList rendered');
  const { t } = useTranslation('transactions', { keyPrefix: 'loader' });
  const { refreshTransactions } = useRefreshTransactions(false);
  const offersIsLoading = useSelector(selectOffersIsLoading);
  const allTransactions = useAppSelector(selectAllTransactions);
  const { propertiesToken } = usePropertiesToken();
  const sortedTransactions = sortTransactions(allTransactions);

  useEffect(() => {
    if (!offersIsLoading) return refreshTransactions();
  }, [offersIsLoading, refreshTransactions]);

  return (
    <>
      {
        <SimpleGrid cols={propertiesToken.length}>
          {propertiesToken.map((token) => (
            <TokenStatsCard
              token={token}
              transactions={sortedTransactions.filter(
                (t) =>
                  t.tokenForSale?.address.toLowerCase() ===
                    token.contractAddress.toLowerCase() ||
                  t.tokenBuyWith?.address.toLowerCase() ===
                    token.contractAddress.toLowerCase()
              )}
              key={token.contractAddress}
            ></TokenStatsCard>
          ))}
        </SimpleGrid>
      }
    </>
  );
};
