import { Dispatch, SetStateAction } from 'react';

import BigNumber from 'bignumber.js';

export type CreatedOffer = {
  offerToken: string;
  buyerToken: string;
  price: BigNumber;
  offerId: BigNumber;
};

export type Offer = {
  offerId: string;
  offerTokenAddress: string;
  offerTokenName: string;
  offerTokenDecimals: string;
  buyerTokenAddress: string;
  buyerTokenName: string;
  buyerTokenDecimals: string;
  sellerAddress: string;
  buyerAddress: string;
  price: string;
  amount: string;
};

export type UseOffers = (
  filterSeller?: boolean,
  filerBuyer?: boolean,
  filterZeroAmount?: boolean
) => {
  offers: Offer[];
  refreshState: [boolean, Dispatch<SetStateAction<boolean>>];
};
