import { Web3Provider } from '@ethersproject/providers';

import BigNumber from 'bignumber.js';

import { PropertiesToken } from 'src/types';
import { DataRealtokenType } from 'src/types/offer/DataRealTokenType';
import { Offer } from 'src/types/offer/Offer';
import { OFFER_TYPE } from 'src/types/offer/OfferType';
import { OFFER_SELLER } from 'src/types/offer/OfferType';
import { Price } from 'src/types/price';

import { Offer as OfferGraphQl } from '../../../.graphclient/index';
import { getPriceInDollar } from '../price';

// TOKEN TYPE
// 1 = RealToken
// 2 = ERC20 avec permit
// 3 = ERC20 sans permit
export const getOfferType = (
  offerTokenType: number,
  buyerTokenType: number,
): OFFER_TYPE => {
  if (offerTokenType == 1 && (buyerTokenType == 2 || buyerTokenType == 3))
    return OFFER_TYPE.SELL;
  if ((offerTokenType == 2 || offerTokenType == 3) && buyerTokenType == 1)
    return OFFER_TYPE.BUY;

  return OFFER_TYPE.EXCHANGE;
};

const CSM_ADDRESSES = ['0x8b998419e00be0705b3a4c6b873c1bb4e0620874'];

export const parseOffer = (
  provider: Web3Provider,
  account: string,
  offer: OfferGraphQl,
  accountUserRealtoken: DataRealtokenType,
  propertiesToken: PropertiesToken[],
  prices: Price,
): Promise<Offer> => {
  return new Promise<Offer>(async (resolve, reject) => {
    try {
      // console.log(
      //   'DEBUG parseOffer accountUserRealtoken',
      //   accountUserRealtoken
      // );

      let balanceWallet = '0';
      let allowance = '0';
      // let logLabel = 'Erreur Type token parseOffer or seller not data in graph realtoken';
      // console.log("OFFER: ", offer)
      if (BigNumber(offer.availableAmount).gt(0)) {
        if (
          offer.offerToken.tokenType === 1 &&
          accountUserRealtoken != undefined
        ) {
          balanceWallet = accountUserRealtoken.amount ?? '0';

          allowance = accountUserRealtoken.allowance ?? '0';

          // logLabel = 'parseOffer type 1 blance/allowance';

          // console.log(
          //   "TESTTTTTTTT",
          //   balanceWallet,
          //   allowance
          // )

          //if (account.balance) balanceWallet = account.balance.toString();
          //if (account.allowance) allowance = account.allowance.toString();
        } else if (
          offer.offerToken.tokenType === 2 ||
          offer.offerToken.tokenType === 3
        ) {
          balanceWallet = offer.balance?.amount ?? offer.availableAmount;
          allowance = offer.allowance?.allowance ?? offer.availableAmount;

          // logLabel = 'parseOffer type 2/3 blance/allowance';
        }

        /*  console.log(logLabel, {
            sellerAdress: offer.seller.address,
            'offer ID': BigNumber(offer.id).toString(),
            'Token name': offer.offerToken.name,
            'Token type': offer.offerToken.tokenType,
            BalanceWallet: balanceWallet,
            Allowance: allowance,
            'YAM autorisé': offer.availableAmount,
          }); */
      }

      const offerSite = propertiesToken.find(
        (t) =>
          t.contractAddress.toLowerCase() ===
          offer.offerToken.address.toLowerCase(),
      );
      const buyingSite = propertiesToken.find(
        (t) =>
          t.contractAddress.toLowerCase() ===
          offer.buyerToken.address.toLowerCase(),
      );

      const o: Offer = {
        offerId: BigNumber(offer.id).toString(),
        offerTokenAddress: (offer.offerToken.address as string)?.toLowerCase(),
        offerTokenName: offerSite
          ? offerSite.shortName
          : (offer.offerToken.name ?? ''),
        offerTokenDecimals: offer.offerToken.decimals?.toString() ?? '',
        offerTokenType: offer.offerToken.tokenType ?? 0,
        offerTokenSymbol: offer.offerToken.symbol,
        buyerTokenAddress: (offer.buyerToken.address as string)?.toLowerCase(),
        buyerTokenName: buyingSite
          ? buyingSite.shortName
          : (offer.buyerToken.name ?? ''),
        buyerTokenSymbol: offer.buyerToken.symbol,
        buyerTokenDecimals: offer.buyerToken.decimals?.toString() ?? '',
        buyerTokenType: offer.buyerToken.tokenType ?? 0,
        sellerAddress: (offer.seller.address as string)?.toLowerCase(),
        sellerName: CSM_ADDRESSES.includes(
          (offer.seller.address as string)?.toLowerCase(),
        )
          ? OFFER_SELLER.CSM
          : OFFER_SELLER.UNKNOWN, //TODO Cyrille
        buyerAddress: (offer.buyer?.address as string)?.toLowerCase(),
        price: offer.price.price.toString(),
        amount:
          BigNumber.minimum(
            offer.availableAmount,
            balanceWallet,
            allowance,
          ).toString(10) ?? '0',
        availableAmount: offer.availableAmount.toString(),
        initialAmount: offer.price.amount,
        balanceWallet: balanceWallet ?? '0',
        allowanceToken: allowance ?? '0',
        hasPropertyToken: false,
        type: undefined,
        removed: offer.removedAtBlock === null ? false : true,
        createdAtTimestamp: offer.createdAtTimestamp,
        buyCurrency: '',
        officialPrice: undefined,
        offerPrice: undefined,
        priceDelta: undefined,
        officialYield: undefined,
        offerYield: undefined,
        yieldDelta: undefined,
        electricityPrice: 0,
        sellDate: '',
        sites: {
          selling: {
            id: offerSite?.uuid ?? '',
            miningSite: offerSite?.miningSite ?? '',
            name: offerSite?.fullName ?? '',
            energy: offerSite?.energy ?? [],
            location: offerSite?.location ?? { aera: '', country: '' },
            imageLink: '',
            electricityPrice: 0,
            tokenOfficialPrice: 0,
            tokenSellDate: '',
          },
          buying: {
            id: buyingSite?.uuid ?? '',
            miningSite: buyingSite?.miningSite ?? '',
            name: buyingSite?.fullName ?? '',
            energy: buyingSite?.energy ?? [],
            location: buyingSite?.location ?? { aera: '', country: '' },
            imageLink: '',
            electricityPrice: 0,
            tokenOfficialPrice: 0,
            tokenSellDate: '',
          },
        },
      };

      o.type = getOfferType(o.offerTokenType, o.buyerTokenType);

      const propertyToken = getProperty(
        o.type == OFFER_TYPE.BUY
          ? o.buyerTokenAddress
          : o.type == OFFER_TYPE.SELL
            ? o.offerTokenAddress
            : '',
        propertiesToken,
      );

      const propertyTokenBuy = getProperty(
        o.buyerTokenAddress,
        propertiesToken,
      );

      const propertyTokenSell = getProperty(
        o.offerTokenAddress,
        propertiesToken,
      );

      //add price and yield infos
      o.buyCurrency = propertyToken?.currency ?? '';
      o.officialPrice = getOfficialPrice(propertyToken);
      o.offerPrice = getPriceInDollar(prices, o);
      o.officialYield = getOfficialYield(propertyToken);
      o.offerYield = getOfferYield(prices, o, propertyToken);
      o.yieldDelta = getYieldDelta(o);
      o.priceDelta = getPriceDelta(prices, o);
      o.sellDate = propertyToken?.sellDate ?? '';
      o.electricityPrice = propertyToken?.electricityPrice ?? 0;
      o.sites.buying.electricityPrice = propertyTokenBuy?.electricityPrice ?? 0;
      o.sites.selling.electricityPrice =
        propertyTokenSell?.electricityPrice ?? 0;
      o.sites.buying.imageLink = propertyTokenBuy?.imageLink[0] ?? '';
      o.sites.selling.imageLink = propertyTokenSell?.imageLink[0] ?? '';
      o.sites.buying.tokenOfficialPrice =
        getOfficialPrice(propertyTokenBuy) ?? 0;
      o.sites.selling.tokenOfficialPrice =
        getOfficialPrice(propertyTokenSell) ?? 0;
      o.sites.buying.tokenSellDate = propertyTokenBuy?.sellDate ?? '';
      o.sites.selling.tokenSellDate = propertyTokenSell?.sellDate ?? '';
      o.miningSite = propertyToken?.miningSite;
      // console.log(offer.availableAmount, balanceWallet, allowance)
      resolve(o);
    } catch (err) {
      console.log('Error when fetching account from TheGraph', err);
      reject(err);
    }
  });
};

const getProperty = (
  propertyAddress: string,
  propertiesToken: PropertiesToken[],
) => {
  return propertiesToken.find(
    (propertyToken) =>
      propertyToken.contractAddress.toLowerCase() ==
      propertyAddress.toLowerCase(),
  );
};

const getOfficialPrice = (
  propertyToken: PropertiesToken | undefined,
): number | undefined => {
  if (propertyToken) {
    const buyPrice = propertyToken.officialPrice;
    return buyPrice;
  } else {
    return undefined;
  }
};

const getOfficialYield = (
  propertyToken: PropertiesToken | undefined,
): number | undefined => {
  // console.log("getOfficialYield: ", propertyToken)
  if (propertyToken) {
    const originalYield = propertyToken.annualYield
      ? propertyToken.annualYield * 100
      : 0;
    return originalYield;
  } else {
    return undefined;
  }
};

const getOfferYield = (
  prices: Price,
  offer: Offer,
  propertyToken: PropertiesToken | undefined,
): number | undefined => {
  const tokenPriceInDollar = getPriceInDollar(prices, offer);
  if (propertyToken && tokenPriceInDollar) {
    const offerAdjusted = new BigNumber(
      propertyToken.netRentYearPerToken,
    ).dividedBy(tokenPriceInDollar);

    return parseFloat(offerAdjusted.multipliedBy(100).toString());
  } else {
    return undefined;
  }
};

const getYieldDelta = (offer: Offer): number | undefined => {
  const offerYield = offer.offerYield;
  const officialYield = offer.officialYield;

  return offerYield && officialYield
    ? parseFloat(
        new BigNumber(offerYield)
          .multipliedBy(new BigNumber(1))
          .dividedBy(new BigNumber(officialYield))
          .minus(1)
          .toString(),
      )
    : undefined;
};

const getPriceDelta = (prices: Price, offer: Offer): number | undefined => {
  const tokenPriceInDollar = getPriceInDollar(prices, offer);
  const officialPrice = offer.officialPrice;

  if (offer.type == OFFER_TYPE.SELL) {
    return officialPrice && tokenPriceInDollar
      ? parseFloat(
          new BigNumber(tokenPriceInDollar)
            .dividedBy(new BigNumber(officialPrice))
            .minus(1)
            .toString(),
        )
      : undefined;
  }
  if (offer.type == OFFER_TYPE.BUY && officialPrice) {
    const tokenInDollar = 1 / parseFloat(offer.price.toString());
    const ratio = officialPrice / tokenInDollar;

    // if(offer.offerId == "135"){
    //   console.log("offer price: ", offer.price.toString())
    //   console.log("officialPrice: ", officialPrice)
    //   console.log("tokenInDollar: ", tokenInDollar)
    //   console.log("ratio: ", ratio)
    // }

    return 1 - ratio;
  }
};
