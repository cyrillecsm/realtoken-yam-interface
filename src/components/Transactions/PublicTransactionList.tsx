import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAtom } from 'jotai';

import { useAppSelector } from 'src/hooks/react-hooks';
import { useRefreshTransactions } from 'src/hooks/transactions/useRefreshTransactions';
import { usePropertiesToken } from 'src/hooks/usePropertiesToken';
import { statesFilterTokenAtom } from 'src/states';
import { selectPublicTransactions } from 'src/store/features/interface/interfaceSelector';
import { selectTransactionsIsLoading } from 'src/store/features/interface/interfaceSelector';
import { useFilterTransactions } from 'src/hooks/transactions/useFilterTransactions';
import { sortTransactions } from './Utils';
import { TransactionList } from './TransactionList';

export const PublicTransactionList = ({}) => {
  const { refreshTransactions } = useRefreshTransactions(false);
  const transactionsIsLoading = useSelector(selectTransactionsIsLoading);
  const allTransactions = useAppSelector(selectPublicTransactions);
  const { propertiesToken } = usePropertiesToken();

  const [, setTokenFilterStates] = useAtom(statesFilterTokenAtom);
  const { transactions } = useFilterTransactions(allTransactions);
  const sortedTransactions = sortTransactions(transactions);

  useEffect(() => {
    setTokenFilterStates(
      new Map(
        propertiesToken.map((token) => [
          token.contractAddress.toLowerCase(),
          true,
        ]),
      ),
    );
  }, [propertiesToken, setTokenFilterStates]);

  useEffect(() => {
    if (!transactionsIsLoading) return refreshTransactions();
  }, [transactionsIsLoading, refreshTransactions]);

  return <TransactionList transactions={sortedTransactions}></TransactionList>;
};