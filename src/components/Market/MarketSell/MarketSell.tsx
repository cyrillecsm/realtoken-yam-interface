import { useState } from 'react';

import { useForm } from '@mantine/form';
import { useWeb3React } from '@web3-react/core';

import { BigNumber } from 'ethers';
import styles from 'styles/MarketSell.module.css';

import { Erc20, Erc20ABI } from 'src/abis';
import { ContractsID } from 'src/constants';
import { useActiveChain } from 'src/hooks';
import { useContract } from 'src/hooks/useContract';
import { getContract } from 'src/utils';

type CreateOfferFormValues = {
  offerTokenAddress: string;
  buyerTokenAddress: string;
  price: string;
  offerId: string;
};

export const MarketSell = () => {
  const [enteredOfferToken, setEnteredOfferToken] = useState('');
  const [enteredBuyerToken, setEnteredBuyerToken] = useState('');
  const [enteredPrice, setEnteredPrice] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [enteredOfferId, setEnteredOfferId] = useState('0');

  const { account, chainId, provider } = useWeb3React();
  const activeChain = useActiveChain();
  const swapCatUpgradeable = useContract(ContractsID.swapCatUpgradeable);

  const offerTokenHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredOfferToken(event.target.value);
  };
  const buyerTokenHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredBuyerToken(event.target.value);
  };
  const priceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredPrice(event.target.value);
  };
  const amountHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredAmount(event.target.value);
  };
  const offerIdHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredOfferId(event.target.value);
  };

  const submitHandler = async (event: any) => {
    event.preventDefault();
    console.log('offer token event');
    console.log(event);

    if (
      !account ||
      !provider ||
      !swapCatUpgradeable ||
      !enteredOfferToken ||
      !enteredBuyerToken ||
      !enteredPrice ||
      !enteredAmount
    ) {
      return;
    }

    const offerTokenContract = getContract<Erc20>(
      enteredOfferToken,
      Erc20ABI,
      provider,
      account
    );
    const buyerTokenContract = getContract<Erc20>(
      enteredBuyerToken,
      Erc20ABI,
      provider,
      account
    );

    if (!offerTokenContract || !buyerTokenContract) {
      console.log('offerTokenContract or buyerTokenContract not found');
      return;
    }

    const offerTokenDecimals = await offerTokenContract.decimals();
    const enteredAmountInWei = BigNumber.from(enteredAmount).mul(
      BigNumber.from(10).pow(offerTokenDecimals)
    );

    const buyerTokenDecimals = await buyerTokenContract?.decimals();
    const enteredPriceInWei = BigNumber.from(enteredPrice).mul(
      BigNumber.from(10).pow(buyerTokenDecimals)
    );

    await swapCatUpgradeable.createOffer(
      enteredOfferToken,
      enteredBuyerToken,
      enteredOfferId,
      enteredPriceInWei.toString(),
      enteredAmountInWei.toString()
    );

    // setEnteredOfferToken('');
    // setEnteredBuyerToken('');
    // setEnteredPrice('');
    // setEnteredAmount('');
  };

  return (
    <div className={styles.new_offer}>
      <form onSubmit={submitHandler}>
        <div className={styles.market_sells}>
          <div className={styles.market_sell}>
            <label>{'Offer Token Address'}</label>
            <input
              type={'text'}
              value={enteredOfferToken}
              onChange={offerTokenHandler}
            />
          </div>
          <div className={styles.market_sell}>
            <label>{'Buyer Token Address'}</label>
            <input
              type={'text'}
              value={enteredBuyerToken}
              onChange={buyerTokenHandler}
            />
          </div>
          <div className={styles.market_sell}>
            <label>{'Price (per unit)'}</label>
            <input
              type={'number'}
              min={'0.01'}
              step={'0.01'}
              value={enteredPrice}
              onChange={priceHandler}
            />
          </div>
          <div className={styles.market_sell}>
            <label>{'Amount'}</label>
            <input
              type={'number'}
              min={'0'}
              step={'0.01'}
              value={enteredAmount}
              onChange={amountHandler}
            />
          </div>

          <div className={styles.market_sell}>
            <label>{'OfferId'}</label>
            <input
              type={'number'}
              min={'0'}
              step={'1'}
              value={enteredOfferId}
              onChange={offerIdHandler}
            />
          </div>
        </div>
        <div className={styles.market_sell_actions}>
          <button onClick={submitHandler} type={'submit'}>
            {'Create Offer'}
          </button>
        </div>
      </form>
    </div>
  );
};
