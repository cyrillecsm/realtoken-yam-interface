import { OFFER_TYPE } from "./OfferType";

export type SiteDetails = {
  id: string;
  miningSite: string;
  name: string;
  location: {
    aera: string;
    country: string;
  };
  energy: string[];
  imageLink: string;
  electricityPrice : number;
  tokenOfficialPrice: number;
  tokenSellDate: string;
};

export type Offer = {
  offerId: string;
  offerTokenAddress: string;
  offerTokenName: string;
  offerTokenDecimals: string;
  offerTokenType:number;
  offerTokenSymbol:string;
  buyerTokenAddress: string;
  buyerTokenName: string;
  buyerTokenDecimals: string;
  buyerTokenSymbol: string;
  buyerTokenType: number;
  sellerAddress: string;
  sellerName: string;
  buyerAddress: string;
  price: string;
  amount: string;
  initialAmount: number;
  hasPropertyToken: boolean;
  removed: boolean;
  availableAmount: string;
  balanceWallet?: string;
  allowanceToken?: string;
  type?: OFFER_TYPE|undefined;
  createdAtTimestamp: number;
  officialPrice: number|undefined;
  offerPrice: number|undefined;
  priceDelta: number|undefined;
  officialYield: number|undefined;
  offerYield: number|undefined;
  yieldDelta: number|undefined;
  buyCurrency: string;
  //
  electricityPrice: number
  sellDate: string
  sites:{
    selling:SiteDetails;
    buying:SiteDetails;
    
  }
  miningSite?: string;
};

export const DEFAULT_OFFER: Offer = {
  offerId: "",
  offerTokenAddress: "",
  offerTokenName: "",
  offerTokenDecimals: "",
  offerTokenType: 0,
  offerTokenSymbol:"",
  buyerTokenAddress: "",
  buyerTokenName: "",
  buyerTokenDecimals: "",
  buyerTokenType: 0,
  buyerTokenSymbol: "",
  sellerAddress: "",
  sellerName: "",
  buyerAddress: "",
  price: "",
  amount: "",
  initialAmount: 0,
  hasPropertyToken: false,
  removed: false,
  availableAmount: "",
  balanceWallet: "",
  type: undefined,
  createdAtTimestamp: 0,
  officialPrice: undefined,
  offerPrice: undefined,
  priceDelta: undefined,
  officialYield: undefined,
  offerYield: undefined,
  yieldDelta: undefined,
  buyCurrency: "",
  //
  electricityPrice: 0,
  sellDate: "",
  sites:{
    selling: {
      id: "",
      miningSite: "",
      name: "",
      location:{
        aera: "",
        country: "",
      },
      energy:[], 
      imageLink: '',
      electricityPrice:0,
      tokenOfficialPrice:0,
      tokenSellDate:'',
    },
    buying: {
      id: "",
      miningSite: "",
      name: "",
      location:{
        aera: "",
        country: "",
      },
      energy:[],
      imageLink: '',
      electricityPrice:0,
      tokenOfficialPrice:0,
      tokenSellDate:'',
    },
  }
}

export const OFFER_LOADING = [DEFAULT_OFFER, DEFAULT_OFFER, DEFAULT_OFFER]