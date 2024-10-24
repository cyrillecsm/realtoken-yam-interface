import type { AppProps as NextAppProps } from 'next/app';
import { ColorScheme } from '@mantine/core';
import store from 'src/store/store';
import 'src/i18next';
import InitStoreProvider from 'src/providers/InitStoreProvider';
import { Provider as JotaiProvider} from 'jotai';
import { Provider as ReduxProvide } from 'react-redux';
import { QueryClient, QueryClientProvider } from "react-query";
import { 
  ChainSelectConfig, 
  Head, 
  LanguageInit, 
  Layout, 
  MantineProviders, 
  RealtProvider, 
  Web3Providers, 
  Websites, 
  getConnectors, 
  getReadOnlyConnector, 
  getWalletConnectV2, 
  gnosisHooks, 
  gnosisSafe, 
  initLanguage, 
  metaMask, 
  metaMaskHooks, 
  parseAllowedChain 
} from '@realtoken/realt-commons';
import { resources } from 'src/i18next';
import { CHAINS, Chain as CustomChain, ChainsID } from '../src/constants';
import { modals } from '../src/components';
import { HeaderNav } from '../src/components/HeaderNav';
import { modalStyles } from '../src/theme';

export const i18n = initLanguage(resources);

const customChains: ChainSelectConfig<CustomChain> = {
  allowedChains: parseAllowedChain(ChainsID),
  chainsConfig: CHAINS
}

const showAllNetworks = true;

const env = process.env.NEXT_PUBLIC_ENV ?? "development";
const walletConnectKey = process.env.NEXT_PUBLIC_WALLET_CONNECT_KEY ?? "";
console.log("key: ", walletConnectKey)

const [walletConnectV2, walletConnectV2Hooks] = getWalletConnectV2<CustomChain>(customChains,env, walletConnectKey, showAllNetworks);
const [readOnly, readOnlyHooks] = getReadOnlyConnector(customChains);

const libraryConnectors = getConnectors({
  metamask: [metaMask, metaMaskHooks],
  gnosisSafe: [gnosisSafe, gnosisHooks],
  walletConnectV2: [walletConnectV2, walletConnectV2Hooks],
  readOnly: [readOnly, readOnlyHooks]
});

type AppProps = NextAppProps & { colorScheme: ColorScheme; locale: string };

const queryClient = new QueryClient({});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <RealtProvider value={{ env, showAllNetworks }}>
          <ReduxProvide store={store}>
            <Web3Providers libraryConnectors={libraryConnectors}>
              <InitStoreProvider>
                <MantineProviders modals={modals} modalStyles={modalStyles}>
                    <LanguageInit i={i18n} />
                    <Layout
                      currentWebsite={Websites.YAM}
                      chains={customChains}
                      head={<Head title='Realtoken YAM (You And Me)' description='Realtoken YAM (You And Me)'/>}
                      headerNav={<HeaderNav/>}
                    >
                      <Component {...pageProps} />
                    </Layout>
                </MantineProviders>
              </InitStoreProvider>
            </Web3Providers>
          </ReduxProvide>
        </RealtProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default App;
