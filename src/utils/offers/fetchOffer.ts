import { gql } from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';

import { PropertiesToken } from 'src/types/PropertiesToken';
import { DataRealtokenType } from 'src/types/offer/DataRealTokenType';
import { Offer } from 'src/types/offer/Offer';
import { Price } from 'src/types/price';

import { Offer as OfferGraphQl } from '../../../.graphclient/index';
import { getRealTokenClient, getYamClient } from '../theGraph/getClientURL';
import { getBigDataGraphRealtoken } from './fetchOffers';
import { getOfferQuery } from './getOfferQuery';
import { parseOffer } from './parseOffer';

export const fetchOffer = (
  provider: Web3Provider,
  account: string,
  chainId: number,
  offerId: number,
  propertiesToken: PropertiesToken[],
  prices: Price
): Promise<Offer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const clientYam = getYamClient(chainId);
      const clientRealToken = getRealTokenClient(chainId);

      const { data } = await clientYam.query({
        query: gql`
          query MyQuery($id: String!) {
            offer(id: $id) {
              ${getOfferQuery()}
            }
          }`,
        variables: {
          id: `0x${offerId.toString(16)}`,
        },
      });

      const offerFromTheGraph: OfferGraphQl = data.offer;

      const batch = [
        `${offerFromTheGraph.seller.address}-${offerFromTheGraph.offerToken.address}`,
      ];
      const realtokenData: [DataRealtokenType] = await getBigDataGraphRealtoken(
        chainId,
        clientRealToken,
        batch
      );

      const accountUser = realtokenData[0];
      const offer = await parseOffer(
        provider,
        account,
        offerFromTheGraph,
        accountUser,
        propertiesToken,
        prices
      );

      const hasPropertyToken = propertiesToken.find(
        (propertyToken) =>
          propertyToken.contractAddress == offer.buyerTokenAddress ||
          propertyToken.contractAddress == offer.offerTokenAddress
      );
      offer.hasPropertyToken = hasPropertyToken ? true : false;

      resolve(offer);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
