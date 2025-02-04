import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { mainnet, arbitrum,holesky, sepolia } from '@reown/appkit/networks';
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

const networks = [mainnet,arbitrum,holesky,sepolia];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 7. Initialize AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Enables analytics
  },
});

// 8. Define AppKit Provider Component
export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
