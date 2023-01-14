import '@rainbow-me/rainbowkit/styles.css'
import { ReactNode } from 'react'

import { RainbowKitProvider, darkTheme, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { coinbaseWallet, injectedWallet, metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import { ETH_CHAINS } from '@/utils/config'

interface Props {
  children: ReactNode
  autoConnect?: boolean
}

export function RainbowKit(props: Props) {
  const { chains, provider } = configureChains(ETH_CHAINS, [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
  ])

  const appName = 'District Labs'
  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({ chains }),
        rainbowWallet({ chains }),
        coinbaseWallet({ chains, appName }),
        walletConnectWallet({ chains }),
      ],
    },
  ])

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor: '#218242',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'large',
        })}>
        {props.children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
