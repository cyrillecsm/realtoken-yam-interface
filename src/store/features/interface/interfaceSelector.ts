import BigNumber from 'bignumber.js';
import { createSelector } from 'reselect';
import { RootState } from 'src/store/store';
import { OFFER_LOADING, Offer } from 'src/types/offer/Offer';
import { Price } from 'src/types/price';
import { Transaction } from 'src/types/transaction/Transaction';

import { selectAddress } from '../settings/settingsSelector';

export const selectOffersIsLoading = createSelector(
  (state: RootState) => state.interface.offers.isLoading, // Remplacez par la logique appropriée
  (isLoading) => isLoading,
);

export const selectTransactionsIsLoading = createSelector(
  (state: RootState) => state.interface.transactions.isLoading, // Remplacez par la logique appropriée
  (isLoading) => isLoading,
);

export const selectProperties = (state: RootState) =>
  state.interface.properties.properties;
export const selectPropertiesIsLoading = (state: RootState) =>
  state.interface.properties.isloading;

export const selectOffers = createSelector(
  (state: RootState) => state.interface.offers.offers, // Remplacez par la logique appropriée
  (offers) => offers,
);

export const selectTransactions = createSelector(
  (state: RootState) => state.interface.transactions.transactions, // Remplacez par la logique appropriée
  (transactions) => transactions,
);

export const selectAddressOffers = (state: RootState) => {
  const address = selectAddress(state);
  const offers = selectOffers(state);

  if (!address || !offers) return OFFER_LOADING;
  return offers.filter((offer: Offer) => offer.sellerAddress == address);
};

export const selectIsOwnOffer = (state: RootState, offer: Offer) => {
  const address = selectAddress(state);

  if (!address) return OFFER_LOADING;
  return offer.sellerAddress === address;
};

export const selectPublicOffers = createSelector(
  [selectOffers, selectOffersIsLoading],
  (offers, offersIsLoading) => {
    if (!offers || offersIsLoading) return OFFER_LOADING;
    return offers.filter(
      (offer: Offer) =>
        !offer.buyerAddress &&
        BigNumber(offer.amount).times(offer.price).gt(0.01) &&
        offer.removed === false,
    );
  },
);

export const selectAllOffers = (state: RootState) => {
  const offers = selectOffers(state);
  const offersIsLoading = selectOffersIsLoading(state);
  if (!offers || offersIsLoading) return OFFER_LOADING;
  return offers;
};

export const selectPrivateOffers = (state: RootState) => {
  const address = selectAddress(state);
  const offers = selectOffers(state);
  const offersIsLoading = selectOffersIsLoading(state);

  if (!address || !offers || offersIsLoading) return OFFER_LOADING;
  return offers.filter((offer: Offer) => offer.buyerAddress == address);
};

export const selectAllTransactions = (state: RootState) => {
  const transactions = selectTransactions(state);
  const transactionsIsLoading = selectTransactionsIsLoading(state);
  if (!transactions || transactionsIsLoading) return [];
  return transactions;
};

export const selectPublicTransactions = createSelector(
  [selectTransactions, selectTransactionsIsLoading],
  (transactions, transactionsIsLoading) => {
    if (!transactions || transactionsIsLoading) return [];
    return transactions.filter(
      (transaction: Transaction) => !transaction.isPrivate,
    );
  },
);

export const selectUserTransactions = createSelector(
  [selectAddress, selectTransactions, selectTransactionsIsLoading],
  (address, transactions, transactionsIsLoading) => {
    if (!transactions || transactionsIsLoading) return [];
    return transactions.filter(
      (transaction: Transaction) => transaction.from === address,
    );
  },
);

export const selectOfferTransactions = (offerId: string) =>
  createSelector(
    [selectTransactions, selectTransactionsIsLoading],
    (transactions, transactionsIsLoading) => {
      if (!transactions || transactionsIsLoading) return [];
      return transactions.filter(
        (transaction: Transaction) => transaction.offerId === offerId,
      );
    },
  );

export const selectPricesIsLoading = (state: RootState): boolean => {
  return state.interface.prices.isLoading;
};

export const selectPrices = (state: RootState): Price => {
  return state.interface.prices.prices;
};
