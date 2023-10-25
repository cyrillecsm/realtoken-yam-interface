import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Group, Stack, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons';

import { CsmSvg } from 'src/assets/currency/Csm';

interface TokenExchangeElementProps {
  token1: string;
  token2: string;
  LogoToken1?: React.FC<any>;
  LogoToken2?: React.FC<any>;
  minWidth?: boolean;
  marginTop?: string;
}
export const TokenExchangeElement: FC<TokenExchangeElementProps> = ({
  token1,
  token2,
  LogoToken1,
  LogoToken2,
  minWidth = true,
  marginTop = '10px',
}) => {
  const { t } = useTranslation('list');
  return (
    <Stack spacing={5} h={'100%'} align={'stretch'} justify={'center'}>
      <Group sx={{ marginTop }} spacing={8} miw={minWidth ? 300 : undefined}>
        <Stack justify={'flex-start'} spacing={0}>
          <Text fz={'md'} fw={'bold'}>
            {token1}
          </Text>
          <div style={{ textAlign: 'center' }}>
            {LogoToken1
              ? React.cloneElement(<LogoToken1 />, { width: '24' })
              : React.cloneElement(<CsmSvg />, { width: '24' })}
          </div>
        </Stack>
        <Stack justify={'flex-start'} spacing={0}>
          <Text fz={'md'} fw={'bold'} sx={{ paddingBottom: '3px' }}>
            {t('for')}
          </Text>
          <div style={{ textAlign: 'center' }}>
            <IconArrowRight size={20} aria-label={'Arrow'} />
          </div>
        </Stack>
        <Stack justify={'flex-start'} spacing={0}>
          <Text fz={'md'} fw={'bold'}>
            {token2}
          </Text>
          <div style={{ textAlign: 'center' }}>
            {LogoToken2
              ? React.cloneElement(<LogoToken2 />, { width: '24' })
              : React.cloneElement(<CsmSvg />, { width: '24' })}
          </div>
        </Stack>
      </Group>
    </Stack>
  );
};