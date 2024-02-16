import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useAppSelector } from 'src/hooks/react-hooks';
import {
  selectIsOwnOffer,
  selectAllOffers,
} from 'src/store/features/interface/interfaceSelector';
import { RootState } from 'src/store/store';
import { Offer } from 'src/types/offer';

import { BuyOffer } from './Buy/BuyOffer';
import { ViewOffer } from './View/ViewOffer';

type OfferProps = {
  offerId: string;
  offer?: Offer;
};

export const DisplayOffer: FC<OfferProps> = ({ offerId }) => {
  const allOffers = useAppSelector(selectAllOffers);
  const offer = allOffers.find((offer) => offer.offerId === offerId);
  const isOwner = useSelector((state: RootState) =>
    offer ? selectIsOwnOffer(state, offer) : false,
  );
  const isDeleted = offer ? offer.removed : false;

  return (
    <>
      {offer !== undefined && (
        <>
          {isOwner || isDeleted ? (
            <ViewOffer offer={offer}></ViewOffer>
          ) : (
            <BuyOffer offer={offer}></BuyOffer>
          )}
        </>
      )}
    </>
  );
};
