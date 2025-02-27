import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { convertQuoteToRoute, executeRoute, getQuote, getChains, getConnections, getTools, getTokenBalance, getToken, updateRouteExecution, getRoutes } from "@lifi/sdk";
import { useAccount } from "wagmi";

// import { customSwitchNetwork } from "../wagmiConfig"; // Uncomment if network switching is needed

const useSwapHook = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { address, isConnected } = useAccount();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTransactionLinks = (route) => {
        route.steps.forEach((step, index) => {
            step.execution?.process.forEach((process) => {
                if (process.txHash) {
                    console.log(
                        `Transaction Hash for Step ${index + 1}, Process ${process.type}:`,
                        process.txHash
                    )
                }
            })
        })
    }

    // ✅ Validate Token Balance
    const validateTokenBalance = async (chainId, tokenAddress, amount) => {
        try {
            console.log(chainId, tokenAddress, amount)
            const token = await getToken(chainId, tokenAddress.address);
            const tokenBalance = await getTokenBalance(address, token);
            console.log("bal", tokenBalance);
            const userBalance = window.BigInt(tokenBalance?.amount || "0");
            const requiredAmount = window.BigInt(amount);
            console.log("Step1", tokenBalance, userBalance, requiredAmount)
            if (userBalance < requiredAmount) {
                console.log("Step2")
                setError("Insufficient token balance. Please check your wallet balance");
                return false;
            }
            console.log("Step3")
            return true;
        } catch (err) {
            console.log("Step4", err)
            setError("Failed to fetch token balance. Please try again.");
            return false;
        }
    };

    // ✅ Validate Available Chains
    const validateChains = async (fromChain, toChain) => {
        try {
            const chains = await getChains();
            if (!chains.some(chain => chain.id === fromChain) || !chains.some(chain => chain.id === toChain)) {
                setError("Selected blockchain is not supported. Please choose a different network.");
                return false;
            }
            return true;
        } catch (err) {
            setError("Failed to fetch supported chains. Please try again.");
            return false;
        }
    };

    // ✅ Validate Available Token Swap/Bridge Routes
    const validateConnections = async (fromChain, fromToken, toChain, toToken) => {
        try {
            const connections = await getConnections({ fromChain, fromToken, toChain, toToken });
            if (!connections || connections.length === 0) {
                setError("Swap/bridge route not supported. Please select different tokens or chains.");
                return false;
            }
            return true;
        } catch (err) {
            setError("Failed to fetch available connections. Please try again.");
            return false;
        }
    };

    // ✅ Validate Available Bridges & Exchanges
    const validateTools = async (chainId) => {
        try {
            const tools = await getTools({ chains: [chainId] });
            if (!tools || tools.bridges.length === 0 || tools.exchanges.length === 0) {
                setError("No available bridges or DEXs for this chain. Please choose another network.");
                return false;
            }
            return true;
        } catch (err) {
            setError("Failed to fetch available tools. Please try again.");
            return false;
        }
    };

    const fetchRoutes = async ({ address }) => {
        if (!address) {
            console.error('Please connect your wallet');
            return;
        }

        try {
            const routesRequest = {
                fromChainId: 1, // Arbitrum
                toChainId: 137, // Optimism
                fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // USDC on Arbitrum
                toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // DAI on Optimism
                fromAmount: '1000000000000', // 10 USDC
                fromAddress: address.toLowerCase(),
            };

            const result = await getRoutes(routesRequest);
            const routes = result.routes;

            return routes
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    }

    // ✅ Fetch Quote with Validations
    const fetchQuote = async ({ address }) => {
        if (!address) {
            setError("Wallet address is required. Please connect your wallet.");
            return;
        }

        const fromChain = 1; // Polygon
        const toChain = 137; // Ethereum Mainnet
        const fromToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // ETH on Ethereum
        const toToken = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon

        // 🔍 Validate Chains & Connections Before Fetching Quote
        if (!(await validateChains(fromChain, toChain))) return;
        if (!(await validateConnections(fromChain, fromToken, toChain, toToken))) return;

        try {
            setLoading(true);
            setError(null);

            const quote = await getQuote({
                fromChain,
                toChain,
                fromToken,
                toToken,
                fromAmount: "1000000000000", // 5 USDT
                fromAddress: address.toLowerCase()
            });

            if (!quote || !quote.estimate || !quote.action) {
                setError("Invalid quote received. Please try again.");
                return;
            }

            return quote;
        } catch (err) {
            setError(err.message || "Failed to fetch a quote. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const executeSwap = async ({ quote }) => {
        if (!quote || !quote.action) {
            setError("Invalid quote. Please fetch a new quote before proceeding.");
            return;
        }

        const { fromChainId, fromToken, toChainId, toToken, fromAmount } = quote.action;

        if (!(await validateChains(fromChainId, toChainId))) return;
        if (!(await validateTools(fromChainId))) return;

        if (!address) {
            setError("Wallet not connected. Please connect your wallet first.");
            return;
        }

        if (!(await validateTokenBalance(fromChainId, fromToken, fromAmount))) return;

        try {
            setLoading(true);
            setError(null);

            const route = convertQuoteToRoute(quote);

            return new Promise((resolve, reject) => {
                executeRoute(route, {
                    updateRouteHook(updatedRoute) {
                        updatedRoute.steps.forEach((step) => {
                            step.execution?.process.forEach((process) => {
                                if (process.txHash && process.status === "PENDING") {
                                    console.log("Transaction sent! TX Hash:", process.txHash);

                                    // ✅ Push execution to background
                                    updateRouteExecution(updatedRoute, { executeInBackground: true });

                                    // ✅ Resolve immediately with TX hash
                                    resolve({ txHash: process.txHash });

                                    return;
                                }
                            });
                        });
                    },
                }) // If executionRoute throws, reject the promise can remove .catch(reject);
                    .then(resolve) // Ensure promise resolves if execution completes
                    .catch((err) => {
                        // ✅ Properly catch errors and set error message
                        if (err.message?.includes("User denied transaction signature") || err.name === "UserRejectedRequestError") {
                            setError("Transaction rejected by the user.");
                        } else if (err.name === "BalanceError" || err.message?.includes("balance is too low")) {
                            setError("Insufficient balance. Please check your wallet and try again.");
                        } else if (err.name === "TransactionExecutionError") {
                            setError("Transaction execution failed. Please try again.");
                        } else {
                            setError(err.message || "An unexpected error occurred.");
                        }

                        reject(err); // Reject promise so caller knows execution failed
                    });
            });

        } catch (err) {
            if (err.message?.includes("User denied transaction signature") || err.name === "UserRejectedRequestError") {
                setError("Transaction rejected by the user.");
            } else if (err.name === "BalanceError" || err.message?.includes("balance is too low")) {
                setError("Insufficient balance. Please check your wallet and try again.");
            } else if (err.name === "TransactionExecutionError") {
                setError("Transaction execution failed. Please try again.");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };


    // ✅ Execute Swap with Validations
    // const executeSwap = async ({ quote }) => {
    //     if (!quote || !quote.action) {
    //         setError("Invalid quote. Please fetch a new quote before proceeding.");
    //         return;
    //     }

    //     const { fromChainId, fromToken, toChainId, toToken, fromAmount } = quote.action;

    //     // 🔍 Validate Chains, Tools, and Connections Before Executing
    //     if (!(await validateChains(fromChainId, toChainId))) return;
    //     // if (!(await validateConnections(fromChainId, fromToken, toChainId, toToken))) return;
    //     if (!(await validateTools(fromChainId))) return;

    //     if (!address) {
    //         setError("Wallet not connected. Please connect your wallet first.");
    //         return;
    //     }

    //     if (!(await validateTokenBalance(fromChainId, fromToken, fromAmount))) return;

    //     try {
    //         setLoading(true);
    //         setError(null);

    //         // ✅ Convert Quote to Route
    //         const route = convertQuoteToRoute(quote);

    //         const executedRoute = await executeRoute(route, {
    //             updateRouteHook(updatedRoute) {
    //                 updatedRoute.steps.forEach((step) => {
    //                     step.execution?.process.forEach((process) => {
    //                         if (process.txHash && process.status === 'PENDING') {
    //                             console.log('Transaction sent! TX Hash:', process.txHash);

    //                             // Now that the TX hash is received, we can stop execution
    //                             updateRouteExecution(updatedRoute, { executeInBackground: true });

    //                             // Stop monitoring further; don't wait for token arrival
    //                             return;
    //                         }
    //                     });
    //                 });
    //             },
    //         });

    //         return executedRoute;

    //         // let transactionHash = null;
    //         // await executeRoute(route, {
    //         //     updateRouteHook: (routeInfo) => {
    //         //         const txHash = getTransactionLinks(routeInfo);
    //         //         if (txHash && !transactionHash) {
    //         //             transactionHash = txHash;
    //         //         }
    //         //     },
    //         // });

    //         // return transactionHash;

    //         // ✅ Execute Swap
    //         // const executedRoute = await executeRoute(route, {
    //         //     updateRouteHook: (routeInfo) => {
    //         //         // console.log("Route updated:", routeInfo);
    //         //         getTransactionLinks(routeInfo);
    //         //     },
    //         //     executeInBackground: true
    //         // });

    //         // return executedRoute;
    //     } catch (err) {
    //         if (err.message?.includes("User denied transaction signature") || err.name === "UserRejectedRequestError") {
    //             setError("Transaction rejected by the user.");
    //         } else if (err.name === "BalanceError" || err.message?.includes("balance is too low")) {
    //             setError("Insufficient balance. Please check your wallet and try again.");
    //         } else if (err.name === "TransactionExecutionError") {
    //             setError("Transaction execution failed. Please try again.");
    //         } else {
    //             setError(err.message || "An unexpected error occurred.");
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return { loading, error, executeSwap, fetchQuote, fetchRoutes, validateTokenBalance };
};

export default useSwapHook;
