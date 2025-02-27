import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { mainnet, arbitrum,holesky, sepolia, polygon } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter, defineNetwork } from '@reown/appkit-adapter-wagmi';

const queryClient = new QueryClient();

const projectId = '7e66aad70270b80cd2e9135fc7196cfd'; 

const metadata = {
  name: 'AppKit Example',
  description: 'Demo of Reown AppKit',
  url: 'http://localhost:3000', 
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

const networks = [mainnet,arbitrum,holesky,sepolia, polygon, arbitrum];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 7. Initialize AppKit modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: sepolia,
  projectId,
  metadata,
  features: {
    analytics: true, // Enables analytics
    email: false,
    socials: [],
    allWallets: true,
    emailShowWallets: true,
    swaps: false,
  },
});

export const customSwitchNetwork = async (targetChainId) => {
  const targetChain = networks.find((chain) => chain.id.toString() === targetChainId);

  if (targetChain) {
    // Dynamically switch to the target network
    modal.switchNetwork(targetChain);
    console.log(`Successfully switched to ${targetChain.name}`);
  } else {
    console.warn("Unsupported network selected.");
    return;
  }
}

// 8. Define AppKit Provider Component
export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
