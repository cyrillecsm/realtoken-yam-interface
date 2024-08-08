import { FC, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ActionIcon, Group } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch } from 'src/hooks/react-hooks';
import { useContextModals } from 'src/hooks/useModals';
import { buyOfferOpen } from 'src/store/features/buyOffer/buyOfferSlice';
import { selectOffersIsLoading } from 'src/store/features/interface/interfaceSelector';
import { Offer } from 'src/types/offer/Offer';

type BuyActions = {
  buyOffer: Offer;
  buttonClassName?: string;
  groupClassName?: string;
};

export const BuyActionsWithPermit: FC<BuyActions> = ({
  buyOffer,
  buttonClassName,
  groupClassName,
}) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const modals = useContextModals();

  const offersIsLoading = useSelector(selectOffersIsLoading);

  //const { refreshOffers } = useRefreshOffers(false);

  const onOpenBuyModal = useCallback(
    (offer: Offer) => {
      dispatch({ type: buyOfferOpen.type, payload: offer });
      //modals.openBuyModal(offer, refreshOffers);
    },
    [dispatch],
  );

  const onOpenWalletModal = useCallback(() => {
    modals.openWalletModal();
  }, [modals]);

  const isAccountOffer: boolean = useMemo(() => {
    if (!buyOffer || !account) return false;
    return buyOffer.sellerAddress == account.toLowerCase();
  }, [buyOffer, account]);

  return (
    <>
      {!offersIsLoading ? (
        <Group position={'center'} className={groupClassName ?? ''}>
          {!isAccountOffer ? (
            <ActionIcon
              color={'green'}
              onClick={() =>
                account ? onOpenBuyModal(buyOffer) : onOpenWalletModal()
              }
              className={buttonClassName ?? ''}
            >
              <IconShoppingCart size={16} aria-label={'Buy'} />
            </ActionIcon>
          ) : (
            <ActionIcon disabled={true} variant={'transparent'} />
          )}
        </Group>
      ) : undefined}
    </>
  );
};
