// Swap using quote
import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { convertQuoteToRoute, executeRoute, getQuote, getTokenBalances, getTokenBalancesByChain } from '@lifi/sdk';

import { createWalletClient, custom } from 'viem';
import Menu from '../../components/Menu/Menu';
import "./Test.css";
import useSwapHook from '../../Hooks/useSwapHook';

function TestPage() {
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [signer, setSigner] = useState(null);
    const [quote, setQuote] = useState(null);
    const { executeSwap, fetchQuote, fetchRoutes, error } = useSwapHook();

    // Extract signer from Wagmi
    useEffect(() => {
        if (walletClient) {
            const viemSigner = createWalletClient({
                account: walletClient.account,
                chain: walletClient.chain,
                transport: custom(walletClient.transport),
            });
            setSigner(viemSigner);
        }
    }, [walletClient]);

    useEffect(() => {
        if (error) {
            console.log("Error Message: ", error)
        }
    }, [error])

    // Get Swap Route
    const getSwapRoutes = async () => {
        if (!address) {
            console.error('Please connect your wallet');
            return;
        }

        try {
            const routes = await fetchRoutes({ address })
            console.log('Swap Routes:', routes);
        } catch (error) {
            console.error('Error fetching quote:', error);
        }
    };

    // Get Swap Quote
    const getSwapQuote = async () => {
        if (!address) {
            console.error('Please connect your wallet');
            return;
        }

        try {
            const quote = await fetchQuote({ address })
            setQuote(quote);
            console.log('Swap Quote:', quote);
        } catch (error) {
            console.error('Error fetching quote:', error);
        }
    };

    // Execute Swap
    const swap = async () => {
        if (!quote) {
            console.error('Quote is not available.');
            return;
        }

        try {
            const res = await executeSwap({ quote });
            console.log('Transaction executed successfully:', res);
        } catch (error) {
            console.error('Error executing swap:', error);
        }
    };

    return (
        <div>
            <Menu />
            <h2 className='tests'>Swap USDT (Ethereum) to WETH (Polygon)</h2>
            {isConnected ? (
                <>
                    <button onClick={getSwapQuote}>Get Swap Quote</button>
                    {quote && <button onClick={swap}>Execute Swap</button>}
                    <br /> <br />
                    <button onClick={getSwapRoutes}>Get Swap Routes</button>
                </>
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );
}

export default TestPage;


// Swap using Routes

// import { useState, useEffect } from 'react';
// import { useAccount, useWalletClient } from 'wagmi';
// import { convertQuoteToRoute, executeRoute, getQuote, getRoutes, getTokenBalances, getTokenBalancesByChain } from '@lifi/sdk';

// import { createWalletClient, custom } from 'viem';
// import Menu from '../../components/Menu/Menu';
// import "./Test.css";

// function TestPage() {
//     const { address, isConnected } = useAccount();
//     const { data: walletClient } = useWalletClient();
//     const [signer, setSigner] = useState(null);
//     const [routes, setRoutes] = useState(null);

//     // Extract signer from Wagmi
//     useEffect(() => {
//         if (walletClient) {
//             const viemSigner = createWalletClient({
//                 account: walletClient.account,
//                 chain: walletClient.chain,
//                 transport: custom(walletClient.transport),
//             });
//             setSigner(viemSigner);
//         }
//     }, [walletClient]);

//     // Get Swap Quote
//     const getSwapRoutes = async () => {
//         if (!address) {
//             console.error('Please connect your wallet');
//             return;
//         }

//         try {
//             const routesRequest = {
//                 fromChainId: 1, // Arbitrum
//                 toChainId: 10, // Optimism
//                 fromTokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDC on Arbitrum
//                 toTokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
//                 fromAmount: '10000', // 10 USDC
//                 fromAddress: address.toLowerCase(),
//             };

//             const result = await getRoutes(routesRequest);
//             const routes = result.routes;

//             setRoutes(routes);
//             console.log('Swap Routes:', routes);
//         } catch (error) {
//             console.error('Error fetching routes:', error);
//         }
//     };

//     // Execute Swap
//     const executeSwap = async () => {
//         if (!routes && routes?.length === 0) {
//             console.error('Route is not available.');
//             return;
//         }

//         const route = routes[0]

//         try {
//             console.log("Executing swap with quote:", route);

//             // ✅ Execute Swap after ensuring chains are loaded
//             const executedRoute = await executeRoute(route, {
//                 // Gets called once the route object gets new updates
//                 updateRouteHook(route) {
//                     console.log(route)
//                 },
//             })

//             console.log('Transaction executed successfully:', executedRoute);
//         } catch (error) {
//             console.error('Error executing swap:', error);
//         }
//     };

//     return (
//         <div>
//             <Menu />
//             <h2 className='tests'>Swap USDT (Ethereum) to WETH (Polygon)</h2>
//             {isConnected ? (
//                 <>
//                     <button onClick={getSwapRoutes}>Get Swap Route</button>
//                     {routes && routes?.length > 0 && <button onClick={executeSwap}>Execute Swap</button>}
//                 </>
//             ) : (
//                 <p>Please connect your wallet</p>
//             )}
//         </div>
//     );
// }

// export default TestPage;