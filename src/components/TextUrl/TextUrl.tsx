import { Flex, Text, createStyles } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';

import { openInNewTab } from 'src/utils/window';

const useStyle = createStyles((theme) => ({
  container: {
    display: 'flex',
    gap: theme.spacing.sm,
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
    borderBottomColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'start',
    '&:hover': {
      borderBottomColor: theme.colors.brand,
      cursor: 'pointer',
    },
  },
  text: {
    '&:hover': {
      color: theme.colors.brand,
      cursor: 'pointer',
    },
  },
}));

interface TextUrlProps {
  url: string;
  children: React.ReactNode;
  accessKey?: string;
}
export const TextUrl = ({ url, children, accessKey }: TextUrlProps) => {
  const { classes } = useStyle();

  return (
    <Flex className={classes.container} onClick={() => openInNewTab(url)}>
      <Text accessKey={accessKey}>{children}</Text>
      <IconExternalLink size={16} />
    </Flex>
  );
};

export const SimpleTextUrl = ({ url, children, accessKey }: TextUrlProps) => {
  const { classes } = useStyle();

  return (
    <Text
      td={'underline'}
      accessKey={accessKey}
      onClick={() => openInNewTab(url)}
      className={classes.text}
    >
      {children}
    </Text>
  );
};
