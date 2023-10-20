import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Badge,
  Card,
  Grid,
  Group,
  MantineTheme,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { BigNumber } from 'bignumber.js';

import { OfferBadge } from 'src/components/Offer/components/OfferTypeBadge';
import { TextUrl } from 'src/components/TextUrl/TextUrl';
import { useOffer } from 'src/hooks/offers/useOffer';
import { useAppDispatch } from 'src/hooks/react-hooks';
import { usePropertiesToken } from 'src/hooks/usePropertiesToken';
import { buyOfferOpen } from 'src/store/features/buyOffer/buyOfferSlice';
import { Offer } from 'src/types/offer';
import { OFFER_TYPE } from 'src/types/offer/OfferType';
import { formatPercent, formatToken, formatUsd } from 'src/utils/format';

import { Columns, OfferData } from '../Types';
import { mapColumnLabels, truncateInMiddle } from '../Utils';

const LINK_ACCESS_KEY = 'TEXT_URL';

const avatarStyle = {
  width: '80px',
  height: '80px',
};

interface ItemElementProps {
  offer: OfferData;
  isLastItem: boolean;
}
export const ItemElement: FC<ItemElementProps> = ({ offer, isLastItem }) => {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const isLarge = !useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const [image, setImage] = useState<string>('');
  const [siteUrl, setSiteUrl] = useState<string>('');
  const { offer: offerAction } = useOffer(parseInt(offer.id));
  const { getPropertyToken, propertiesIsloading } = usePropertiesToken();
  const { t } = useTranslation('buy', { keyPrefix: 'list' });
  const columnLabels = mapColumnLabels(offer.type, t);

  useEffect(() => {
    if (!offer || propertiesIsloading) return undefined;

    if (offer.type === OFFER_TYPE.BUY) {
      const token = getPropertyToken(offer.purchaseTokenAddress);
      if (token) {
        offer.image = token.imageLink[0];
        setImage(token.imageLink[0]);
        setSiteUrl(token.marketplaceLink);
      }
    } else {
      const token = getPropertyToken(offer.forSaleTokenAddress);
      if (token) {
        offer.image = token.imageLink[0];
        setImage(token.imageLink[0]);
        setSiteUrl(token.marketplaceLink);
      }
    }
  }, [getPropertyToken, offer, propertiesIsloading]);

  const lastCardStyle = isLastItem
    ? {
        marginTop: '-1px',
        borderRadius: '0 0 10px 10px',
        cursor: 'pointer',
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
      }
    : {
        marginTop: '-1px',
        cursor: 'pointer',
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
      };

  const priceDelta = new BigNumber(
    offer.requestedSellingPrice ?? offer.initialSellingPrice ?? 0
  )
    .minus(offer.initialSellingPrice ?? 0)
    .dividedBy(
      offer.initialSellingPrice && offer.initialSellingPrice !== 0
        ? offer.initialSellingPrice
        : 1
    )
    .toNumber();

  const priceDeltaColor =
    priceDelta === 0 ? 'dimmed' : priceDelta > 0 ? 'red' : 'teal';

  const siteInfo: string[] = offer.siteLocation
    .split('(') //.split(/\(| et /)
    .map((locationPart) => locationPart.replace(')', ''))
    .map((locationPart) => locationPart.replace(' et ', ', '));

  // Triez les valeurs de siteInfo et formatez-les
  const sortedSiteInfo = siteInfo.map((locationPart, index) => {
    const indexOrder = [1, 0, 2, 3]; // Ordre d'index souhaité
    return {
      text: locationPart,
      size: index === 1 ? 'lg' : index > 1 ? 'sm' : 'md',
      fontWeight: index === 1 ? 'bold' : undefined,
      color: index > 1 ? 'dimmed' : undefined,
      order: indexOrder.indexOf(index),
    };
  });

  // Utilisation de map pour générer les balises Text
  const locationInfo = sortedSiteInfo
    .sort((a, b) => a.order - b.order)
    .map((info, index) => (
      <Text
        fz={info.size}
        fw={info.fontWeight}
        key={index}
        color={info.color}
        style={{ padding: 0, margin: 0 }}
      >
        {info.text}
      </Text>
    ));

  const siteToken =
    offer.type === OFFER_TYPE.BUY
      ? offer.purchaseToken
      : offer.type === OFFER_TYPE.SELL
      ? offer.forSaleToken
      : offer.forSaleToken;

  const tradeToken =
    offer.type === OFFER_TYPE.BUY
      ? offer.forSaleToken
      : offer.type === OFFER_TYPE.SELL
      ? offer.purchaseToken
      : offer.purchaseToken;

  const onOpenOffer = useCallback(
    (offerAction: Offer) => {
      dispatch({ type: buyOfferOpen, payload: offerAction });
    },
    [dispatch]
  );

  const handleClickEvent = (event: React.PointerEvent<HTMLDivElement>) => {
    const target: HTMLDivElement = event.target as HTMLDivElement;
    console.log('CLICK EVENT', offer.id);
    if (target.accessKey !== LINK_ACCESS_KEY) {
      offerAction
        ? onOpenOffer(offerAction)
        : console.warn('Offer not loaded ' + offer.id);
    }
  };

  return (
    <Card
      withBorder={true}
      radius={0}
      style={lastCardStyle}
      onClick={handleClickEvent}
    >
      <Grid columns={20}>
        <Grid.Col xl={4} lg={5}>
          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
            }}
          >
            <OfferBadge
              offerType={offer.type}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                borderBottomRightRadius: '10px',
              }}
              id={offer.id}
            ></OfferBadge>
          </div>
          <Group
            spacing={isMobile ? 10 : isLarge ? 0 : 30}
            position={isLarge ? 'apart' : 'left'}
          >
            <Stack spacing={5}>
              <Group sx={{ marginTop: '10px' }}>
                <Text fz={'md'} fw={'bold'}>
                  <TextUrl url={siteUrl} accessKey={LINK_ACCESS_KEY}>
                    {siteToken}
                  </TextUrl>
                </Text>
              </Group>
              <Group position={'left'}>
                <Avatar
                  src={image}
                  alt={offer.id}
                  style={avatarStyle}
                  radius={37}
                />
                <div style={{ padding: 0, margin: 0 }}>{locationInfo}</div>
              </Group>
            </Stack>
            {!isLarge && badgeList(offer, theme)}
          </Group>
        </Grid.Col>
        <Grid.Col xl={4} lg={4} style={{ padding: isMobile ? 0 : undefined }}>
          {isLarge && badgeList(offer, theme)}
        </Grid.Col>
        <Grid.Col
          xl={3}
          lg={2}
          md={5}
          sm={5}
          xs={5}
          style={{
            paddingTop: isMobile ? 0 : undefined,
            paddingBottom: isMobile ? 0 : undefined,
          }}
        >
          {!isMobile && stackSeller()}
        </Grid.Col>
        <Grid.Col
          xl={3}
          lg={3}
          md={5}
          sm={5}
          xs={5}
          style={{
            paddingTop: isMobile ? 0 : undefined,
            paddingBottom: isMobile ? 0 : undefined,
          }}
        >
          {!isMobile && stackTokenPrice()}
        </Grid.Col>
        <Grid.Col
          xl={3}
          lg={3}
          md={5}
          sm={5}
          xs={5}
          style={{
            paddingTop: isMobile ? 0 : undefined,
            paddingBottom: isMobile ? 0 : undefined,
          }}
        >
          {!isMobile && stackTradeToken()}
        </Grid.Col>
        <Grid.Col
          xl={3}
          lg={3}
          md={5}
          sm={5}
          xs={5}
          style={{
            paddingTop: isMobile ? 0 : undefined,
            paddingBottom: isMobile ? 0 : undefined,
          }}
        >
          {!isMobile && stackAmountForSale()}
        </Grid.Col>

        <Grid.Col
          style={{
            paddingTop: isMobile ? 5 : 0,
            paddingBottom: isMobile ? 5 : 0,
          }}
        >
          {isMobile && (
            <Stack>
              <Group position={'apart'}>
                {stackSeller()}
                {stackTradeToken(true)}
              </Group>
              <Group position={'apart'}>
                {stackTokenPrice()}
                {stackAmountForSale(true)}
              </Group>
            </Stack>
          )}
        </Grid.Col>
      </Grid>
    </Card>
  );

  function stackAmountForSale(textAlignRight = false) {
    return (
      <Stack
        h={'100%'}
        align={'stretch'}
        justify={isLarge ? 'center' : 'flex-start'}
        spacing={0}
      >
        {!isLarge && (
          <Text
            fz={'md'}
            ta={textAlignRight ? 'right' : 'left'}
            color={'dimmed'}
          >
            {columnLabels[Columns.quantityAvailable]}
          </Text>
        )}
        <div>
          <Text
            fz={isLarge ? 'lg' : 'md'}
            ta={isLarge || textAlignRight ? 'right' : 'left'}
            fw={500}
          >
            {formatToken(offer.quantityAvailable ?? 0)}
          </Text>
          <Text
            fz={isLarge ? 'xs' : 'xs'}
            color={'dimmed'}
            ta={isLarge || textAlignRight ? 'right' : 'left'}
          >
            {formatUsd(
              (offer.quantityAvailable ?? 0) *
                (offer.requestedSellingPrice ?? 0)
            )}
          </Text>
        </div>
      </Stack>
    );
  }

  function stackTradeToken(textAlignRight = false) {
    return (
      <Stack
        h={'100%'}
        align={'stretch'}
        justify={isLarge ? 'center' : 'flex-start'}
        spacing={0}
      >
        {!isLarge && (
          <Text
            fz={'md'}
            ta={textAlignRight ? 'right' : 'left'}
            color={'dimmed'}
          >
            {columnLabels[Columns.purchaseToken]}
          </Text>
        )}
        <div>
          <Text
            fz={'md'}
            ta={isLarge || textAlignRight ? 'right' : 'left'}
            fw={500}
          >
            {tradeToken}
          </Text>
          <Text
            fz={'xs'}
            color={'dimmed'}
            ta={isLarge || textAlignRight ? 'right' : 'left'}
          >
            {'Gnosis'}
          </Text>
        </div>
      </Stack>
    );
  }

  function stackTokenPrice() {
    return (
      <Stack
        h={'100%'}
        align={'stretch'}
        justify={isLarge ? 'center' : 'flex-start'}
        spacing={0}
      >
        {!isLarge && (
          <Text fz={'md'} ta={'left'} color={'dimmed'}>
            {columnLabels[Columns.requestedSellingPrice]}
          </Text>
        )}
        <div>
          <Text
            fz={isLarge ? 'md' : 'md'}
            ta={isLarge ? 'right' : 'left'}
            fw={500}
          >
            {formatUsd(
              offer.requestedSellingPrice ?? offer.initialSellingPrice ?? 0
            )}
          </Text>
          <Text
            fz={isLarge ? 'xs' : 'xs'}
            color={priceDeltaColor}
            ta={isLarge ? 'right' : 'left'}
          >
            {(priceDelta > 0 ? '+' : '') + formatPercent(priceDelta)}
          </Text>
        </div>
      </Stack>
    );
  }

  function stackSeller() {
    return (
      <Stack
        h={'100%'}
        align={'stretch'}
        justify={isLarge ? 'center' : 'flex-start'}
        spacing={0}
      >
        {!isLarge && (
          <Text fz={'md'} ta={'left'} color={'dimmed'}>
            {columnLabels[Columns.creatorName]}
          </Text>
        )}
        <div>
          <Text fz={'md'} ta={isLarge ? 'right' : 'left'}>
            {t(offer.creatorName)}
          </Text>
          <Text
            fz={isLarge ? 'xs' : 'xs'}
            color={'dimmed'}
            ta={isLarge ? 'right' : 'left'}
            //truncate={'start'}
            //style={{ color: 'rgba(0, 0, 0, 0)' }}
          >
            {truncateInMiddle(offer.creatorAddress)}
          </Text>
        </div>
      </Stack>
    );
  }
};

export const ItemEmptyElement: FC = () => {
  const theme = useMantineTheme();
  const { t } = useTranslation('buy', { keyPrefix: 'list' });
  return (
    <Card
      withBorder={true}
      radius={0}
      style={{
        marginTop: '-1px',
        borderRadius: '0 0 10px 10px',
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
      }}
    >
      <Text ta={'center'}>{t('noData')}</Text>
    </Card>
  );
};

function badgeList(offer: OfferData, theme: MantineTheme) {
  return (
    <Stack spacing={5} h={'100%'} align={'stretch'} justify={'flex-end'}>
      <div>
        <Badge
          variant={'light'}
          color={'lime'}
          radius={'sm'}
          style={{
            backgroundColor:
              theme.colorScheme === 'dark'
                ? `${theme.colors.brand[5]}0F`
                : `${theme.colors.brand[6]}0F`,
            color:
              theme.colorScheme === 'dark'
                ? `${theme.colors.brand[5]}`
                : `${theme.colors.brand[6]}`,
          }}
        >
          <Group>
            <Text>{'Initial Price '}</Text>
            <Text>{formatUsd(offer.initialSellingPrice ?? 0)}</Text>
          </Group>
        </Badge>
      </div>
      <div>
        <Badge
          variant={'light'}
          color={'yellow'}
          radius={'sm'}
          style={{
            backgroundColor: `${theme.colors.yellow[5]}0F`,
            color: theme.colors.yellow[5],
          }}
        >
          <Group>
            <Text>{'Electricity Price'}</Text>
            <Text>{formatUsd(offer.electricityPrice, 4)}</Text>
          </Group>
        </Badge>
      </div>
      <div>
        <Badge
          variant={'light'}
          color={'yellow'}
          radius={'sm'}
          style={{
            backgroundColor: `${theme.colors.yellow[5]}0F`,
            color: theme.colors.yellow[5],
          }}
        >
          <Group>
            <Text>{'Launch Date'}</Text>
            <Text>{offer.launchDate}</Text>
          </Group>
        </Badge>
      </div>
    </Stack>
  );
}