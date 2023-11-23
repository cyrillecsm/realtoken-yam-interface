import { gql } from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';
import { createAction, createReducer } from '@reduxjs/toolkit';

import { getRightAllowBuyTokens } from 'src/hooks/useAllowedTokens';
import { AppDispatch, RootState } from 'src/store/store';
import { PropertiesToken } from 'src/types';
import { AllowedToken } from 'src/types/allowedTokens';
import { OFFER_LOADING, Offer } from 'src/types/offer/Offer';
import { Price } from 'src/types/price';
import { Transaction } from 'src/types/transaction/Transaction';
import { fetchOffersTheGraph } from 'src/utils/offers/fetchOffers';
import { getPrice } from 'src/utils/price';
import { Price as P } from 'src/utils/price';
import { getRealTokenClient } from 'src/utils/theGraph/getClientURL';
import { fetchTransactionsTheGraph } from 'src/utils/transactions/fetchTransactions';

interface InterfaceInitialStateType {
  offers: {
    isLoading: boolean;
    offers: Offer[];
  };
  transactions: {
    isLoading: boolean;
    transactions: Transaction[];
  };
  privateOffers: Offer[];
  properties: {
    isloading: boolean;
    properties: PropertiesToken[];
  };
  wlProperties: {
    isloading: boolean;
    wlPropertiesId: number[];
  };
  prices: {
    isLoading: boolean;
    prices: Price;
  };
}

const interfaceInitialState: InterfaceInitialStateType = {
  offers: {
    isLoading: true,
    offers: OFFER_LOADING,
  },
  transactions: {
    isLoading: true,
    transactions: [],
  },
  privateOffers: [],
  properties: {
    properties: [],
    isloading: true,
  },
  wlProperties: {
    isloading: true,
    wlPropertiesId: [],
  },
  prices: {
    isLoading: true,
    prices: {},
  },
};

//DISPATCH TYPE
export const offersChangedDispatchType = 'interface/offersChanged';
export const offersIsLoadingDispatchType = 'interface/offersIsLoading';
export const offersResetDispatchType = 'interface/offersReset';
export const transactionsChangedDispatchType = 'interface/transactionsChanged';
export const transactionsIsLoadingDispatchType =
  'interface/transactionsIsLoading';
export const transactionsResetDispatchType = 'interface/transactionsReset';
export const propertiesChangedDispatchType = 'interface/propertiesChanged';
export const propertiesIsLoadingDispatchType = 'interface/propertiesIsLoading';
export const chainPropertiesChangedDispatchType =
  'interface/chainPropertiesChanged';
export const wlPropertiesIdChangedDispatchType =
  'interface/wlPropertiesIdChanged';
export const wlPropertiesIdIsloadingChangedDispatchType =
  'interface/wlPropertiesIdIsloadingChanged';
export const pricesIsLoadingChangedDispatchType =
  'interface/pricesIsLoadingChanged';
export const pricesChangedDispatchType = 'interface/pricesChanged';

//ACTIONS
export const offersChanged = createAction<Offer[]>(offersChangedDispatchType);
export const offersIsloading = createAction<boolean>(
  offersIsLoadingDispatchType
);
export const offersReset = createAction<undefined>(offersResetDispatchType);
export const transactionsChanged = createAction<Transaction[]>(
  transactionsChangedDispatchType
);
export const transactionsIsloading = createAction<boolean>(
  transactionsIsLoadingDispatchType
);
export const transactionsReset = createAction<undefined>(
  transactionsResetDispatchType
);
export const propertiesChanged = createAction<PropertiesToken[]>(
  propertiesChangedDispatchType
);
export const propertiesIsLoading = createAction<boolean>(
  propertiesIsLoadingDispatchType
);
export const wlPropertiesIdChanged = createAction<number[]>(
  wlPropertiesIdChangedDispatchType
);
export const wlPropertiesIdIsloading = createAction<boolean>(
  wlPropertiesIdIsloadingChangedDispatchType
);
export const pricesIsLoadingChanged = createAction<boolean>(
  pricesIsLoadingChangedDispatchType
);
export const pricesChanged = createAction<Price>(pricesChangedDispatchType);

// THUNKS
export function fetchOffers(
  provider: Web3Provider,
  account: string,
  chainId: number,
  properties: PropertiesToken[]
) {
  // TODO: look for type
  return async function fetchOffersThunk(
    dispatch: AppDispatch,
    getState: () => RootState
  ) {
    dispatch({ type: offersResetDispatchType });
    dispatch({ type: offersIsLoadingDispatchType, payload: true });

    const prices = getState().interface.prices.prices;

    let offersData;
    if (chainId == 1 || chainId == 100 || chainId == 5) {
      //offersData = await fetchOfferTheGraph(chainId,properties);
      offersData = await fetchOffersTheGraph(
        provider,
        account,
        chainId,
        properties,
        prices
      );
    }
    // else{
    //   offersData = await fetchOffersBasic(realTokenYamUpgradeable,provider,account,properties);
    // }
    //console.log('FETCH', JSON.stringify(offersData, null, 4));
    dispatch({ type: offersChangedDispatchType, payload: offersData });
    dispatch({ type: offersIsLoadingDispatchType, payload: false });
  };
}
export function fetchTransactions(chainId: number) {
  // TODO: look for type
  return async function fetchTransactionsThunk(
    dispatch: AppDispatch,
    getState: () => RootState
  ) {
    dispatch({ type: transactionsResetDispatchType });
    dispatch({ type: transactionsIsLoadingDispatchType, payload: true });

    const offers = getState().interface.offers.offers;

    const transactionsData = await fetchTransactionsTheGraph(chainId, offers);

    dispatch({
      type: transactionsChangedDispatchType,
      payload: transactionsData,
    });
    dispatch({ type: transactionsIsLoadingDispatchType, payload: false });
  };
}
export function fetchProperties(chainId: number) {
  return async function fetchPropertiesThunk(dispatch: AppDispatch) {
    try {
      const response = await fetch(`/tokens.json`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const responseJson: PropertiesToken[] = await response.json();
        //console.log('responseJson', JSON.stringify(responseJson, null, 4));
        dispatch({
          type: propertiesChangedDispatchType,
          payload: responseJson,
        });
        dispatch({ type: propertiesIsLoadingDispatchType, payload: false });
      }
    } catch (err) {
      console.log('Failed to load properties from API.');
    }
  };
}
export function fetchAddressWlProperties(address: string, chainId: number) {
  return async function fetchAddressWlPropertiesThunk(dispatch: AppDispatch) {
    try {
      const realTokenGraphClient = getRealTokenClient(chainId);

      //TODO: finish query
      const { data } = await realTokenGraphClient.query({
        query: gql`
        query fetchWlToken{
          account(id: "${address.toLowerCase()}") {
            id
            userId {
              attributeKeys
            }
          }
        }
      `,
      });

      const wlTokenIds: string[] = data.account.userId.attributeKeys;

      // console.log(wlTokenIds)

      if (wlTokenIds) {
        const numberWlTokenIds = wlTokenIds.map((str) => parseInt(str));
        dispatch({
          type: wlPropertiesIdChangedDispatchType,
          payload: numberWlTokenIds,
        });
        dispatch({
          type: wlPropertiesIdIsloadingChangedDispatchType,
          payload: false,
        });
      }
    } catch (err) {
      console.log('Failed to fetch wl properties for connected address.');
    }
  };
}
export function fetchPrices(chainId: number, provider: Web3Provider) {
  return async function fetchPricesThunk(dispatch: AppDispatch) {
    try {
      const tokens = getRightAllowBuyTokens(chainId);
      const p = await Promise.all(
        tokens.map((allowedToken: AllowedToken) =>
          getPrice(provider, allowedToken)
        )
      );

      const prices: Price = {};
      p.forEach((p: P) => (prices[p.contractAddress.toLowerCase()] = p.price));

      dispatch({ type: pricesChangedDispatchType, payload: prices });
      dispatch({ type: pricesIsLoadingChangedDispatchType, payload: false });
    } catch (err) {
      console.log();
    }
  };
}

export const interfaceReducers = createReducer(
  interfaceInitialState,
  (builder) => {
    builder
      .addCase(offersChanged, (state, action) => {
        state.offers.offers = action.payload;
      })
      .addCase(offersIsloading, (state, action) => {
        state.offers.isLoading = action.payload;
      })
      .addCase(offersReset, (state) => {
        state.offers.offers = OFFER_LOADING;
      })
      .addCase(transactionsChanged, (state, action) => {
        state.transactions.transactions = action.payload;
      })
      .addCase(transactionsIsloading, (state, action) => {
        state.transactions.isLoading = action.payload;
      })
      .addCase(transactionsReset, (state) => {
        state.transactions.transactions = [];
      })
      .addCase(propertiesChanged, (state, action) => {
        state.properties.properties = action.payload;
      })
      .addCase(propertiesIsLoading, (state, action) => {
        state.properties.isloading = action.payload;
      })
      .addCase(wlPropertiesIdChanged, (state, action) => {
        state.wlProperties.wlPropertiesId = action.payload;
      })
      .addCase(wlPropertiesIdIsloading, (state, action) => {
        state.wlProperties.isloading = action.payload;
      })
      .addCase(pricesChanged, (state, action) => {
        state.prices.prices = action.payload;
      })
      .addCase(pricesIsLoadingChanged, (state, action) => {
        state.prices.isLoading = action.payload;
      });
  }
);
