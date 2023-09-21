import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Notification, createStyles, useMantineTheme } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';

import { UrlContactUs, UrlForms, UrlMtPelerin } from 'src/constants';

const useStyle = createStyles((theme) => ({
  notification: {
    marginBottom: '16px',
    backgroundColor:
      theme.colorScheme === 'dark' ? undefined : theme.colors.gray[0],
    fontSize: theme.fontSizes.xl,
  },
  text: {
    fontSize: theme.fontSizes.md,
  },
  link: {
    fontSize: theme.fontSizes.md,
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
    borderBottomColor: 'transparent',
    color: theme.colors.brand,
    textDecoration: 'none',
    '&:hover': {
      color: theme.colors.brand,
      borderBottomColor: theme.colors.brand,
      cursor: 'pointer',
    },
  },
  email: {
    fontSize: theme.fontSizes.md,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'transparent',
    textDecoration: 'underline',
    color: theme.colors.brand,
    '&:hover': {
      textDecoration: 'underline',
      //fontWeight: 'bold',
      cursor: 'pointer',
      color: theme.colors.brand,
    },
  },
  imageLink: {
    marginLeft: '2px',
    marginBottom: '-1px',
    alignItems: 'end',
  },
}));

export const NotificationCompliance = ({
  isNotificationClosed,
  setIsNotificationClosed,
}: {
  isNotificationClosed: boolean;
  setIsNotificationClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation('notifications', { keyPrefix: 'kycRequired' });
  const { colors } = useMantineTheme();
  /*const [isNotificationClosed, setIsNotificationClosed] =
    useState<boolean>(closeNotification);*/

  function formatParagraphe(text: string, key: number): JSX.Element {
    const subTexts = text.split(UrlMtPelerin.keyword);

    return (
      <p key={'p' + key} className={classes.text}>
        {subTexts.map((subText, j) => {
          const baseKey = key * 100 + j;
          return (
            <React.Fragment key={'F' + baseKey}>
              {j > 0 && link(baseKey)}
              {formatContactUs(subText, baseKey)}
            </React.Fragment>
          );
        })}

        {/* {newText} {i == 2 && MtPelerinLink()} */}
      </p>
    );

    function link(key: number) {
      return (
        <a
          className={classes.link}
          target={'_blank'}
          rel={'noreferrer'}
          href={UrlMtPelerin.url}
          key={'aPelerin' + key}
        >
          {UrlMtPelerin.keyword}
          {
            <IconExternalLink
              key={'Pelerin' + key}
              size={14}
              color={colors.brand[9]}
              className={classes.imageLink}
            />
          }
        </a>
      );
    }
  }

  function formatContactUs(text: string, key: number): JSX.Element {
    const subTexts = text.split(t(UrlContactUs.keyword));

    function link(j: number) {
      return (
        <a
          className={classes.link}
          href={'mailto:' + UrlContactUs.url}
          key={'aPelerin' + key + 'contact' + j}
        >
          {t(UrlContactUs.keyword)}
          <IconExternalLink
            key={'Pelerin' + key + 'contact' + j}
            size={14}
            color={colors.brand[9]}
            className={classes.imageLink}
          />
        </a>
      );
    }

    return (
      <React.Fragment key={'FCcontact' + key}>
        {subTexts.map((subText, j) => {
          return (
            <React.Fragment key={'FCcontact' + key + j}>
              {j > 0 && link(j)}
              {formatContactEmail(subText, key + j)}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }

  function formatContactEmail(text: string, key: number): JSX.Element {
    const subTexts = text.split(UrlContactUs.url);

    function link(j: number) {
      return (
        <a
          className={classes.email}
          href={'mailto:' + UrlContactUs.url}
          key={'aPelerin' + key + 'email' + j}
        >
          {UrlContactUs.url}
        </a>
      );
    }

    return (
      <React.Fragment key={'FC email' + key}>
        {subTexts.map((subText, j) => {
          return (
            <React.Fragment key={'FC email' + key + j}>
              {j > 0 && link(j)}
              {formatForms(subText, key + j)}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
  function formatForms(text: string, key: number): JSX.Element {
    const subTexts = text.split(t(UrlForms.keyword));

    function link(j: number) {
      return (
        <a
          className={classes.link}
          target={'_blank'}
          rel={'noreferrer'}
          href={UrlForms.url}
          key={'aPelerin' + key + 'form' + j}
        >
          {t(UrlForms.keyword)}
          <IconExternalLink
            key={'Pelerin' + key + 'form' + j}
            size={14}
            color={colors.brand[9]}
            className={classes.imageLink}
          />
        </a>
      );
    }

    return (
      <React.Fragment key={'FC form' + key}>
        {subTexts.map((subText, j) => {
          return (
            <React.Fragment key={'FC form' + key + j}>
              {j > 0 && link(j)}
              {subText}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }

  return (
    <>
      {!isNotificationClosed && (
        <Notification
          className={classes.notification}
          color={'yellow'}
          title={t('title')}
          onClose={() => {
            setIsNotificationClosed(() => true);
          }}
        >
          {t('message')
            .split('\n')
            .map(function (text, i): JSX.Element {
              return formatParagraphe(text, i);
            })}
        </Notification>
      )}
    </>
  );
};