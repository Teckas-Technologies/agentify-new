import { useState } from "react";
import { ethers } from "ethers";
import { constant } from "../config/constant";
import { usdtABI } from "../config/usdtABI";
import { useContract } from "../contexts/ContractProvider";
export const useGeneric = () => {
    const [processing, setProcessing] = useState(false);
    const [convertionFailed, setConvertionFailed] = useState(false);
    const [approveSuccess, setApproveSuccess] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [errorReason, setErrorReason] = useState("");
    const { contract, provider } = useContract();
    const handleError = (error, tokenType) => {
        console.error(`Error with ${tokenType}:`, error);
        setErrorReason(error.message || "An unknown error occurred.");
    };
    const functionCall = async (functionName, params, tokenABI) => {
        if (!contract) {
            console.error("Contract not found", tokenABI);
            return { success: false, error: "Contract not found" };
        }

        try {
            console.log("Params in functionCall:", params);

            let ethValue = null; // For ETH contributions
            const finalArgs = []; // Final arguments for the contract function

            // Process params dynamically
            for (const param of params) {
                if (param.amount && !param.tokenAddress) {
                    // Handle ETH contribution
                    ethValue = ethers.utils.parseEther(param.amount); // Convert ETH amount to BigNumber
                } else if (param.tokenAddress && param.amount) {
                    // Handle token contribution
                    const decimals = await getTokenDecimals(param.tokenAddress, tokenABI); // Get token decimals dynamically
                    const amountInBigNumber = ethers.utils.parseUnits(param.amount, decimals); // Convert amount to BigNumber
                    finalArgs.push(amountInBigNumber.toString()); // Push token address and converted amount
                } else {
                    // Handle non-token, non-amount parameters
                    finalArgs.push(...Object.values(param)); // Push other parameter values
                }
            }

            console.log("Final arguments for contract function:", finalArgs);
            console.log("ETH value to send:", ethValue ? ethValue.toString() : "None");

            if (typeof contract[functionName] !== "function") {
                throw new Error(`Function ${functionName} does not exist on the contract`);
            }

            // Estimate gas and execute transaction
            const gasLimit = await contract.estimateGas[functionName](...finalArgs, ethValue ? { value: ethValue } : {});
            const tx = await contract[functionName](...finalArgs, ethValue ? { value: ethValue, gasLimit } : { gasLimit });
            const receipt = await tx.wait();

            return { success: true, data: receipt };
        } catch (error) {
            console.error("Error executing function call:", error);
            handleError(error, "Transaction");
            return { success: false, error: error.message };
        }
    };
    // const functionCall = async (functionName, params, tokenABI) => {
    //     if (!contract) {
    //         console.error("Contract not found", tokenABI);
    //         return { success: false, error: "Contract not found" };
    //     }

    //     try {
    //         console.log("Params in functionCall:", params);

    //         // Convert params for function call
    //         const parsedParams = await Promise.all(
    //             params.map(async (param) => {
    //                 if (param.tokenAddress && param.amount) {
    //                     // Fetch token decimals
    //                     const decimals = await getTokenDecimals(param.tokenAddress, tokenABI);

    //                     // Convert amount to BigNumber based on decimals
    //                     const amountInBigNumber = ethers.utils.parseUnits(param.amount, decimals);

    //                     return {
    //                         amount: amountInBigNumber.toString() // Convert BigNumber to string for logging
    //                     };
    //                 }
    //                 return param; // Non-token params pass through as-is
    //             })
    //         );

    //         const args = parsedParams.map((param) => {
    //             if (param.tokenAddress) {
    //                 // Push tokenAddress and amount as arguments
    //                 return [param.tokenAddress, param.amount];
    //             }
    //             return Object.values(param); // Push other arguments
    //         }).flat();

    //         console.log("Final arguments for contract function:", args);

    //         if (typeof contract[functionName] !== "function") {
    //             throw new Error(`Function ${functionName} does not exist on the contract`);
    //         }

    //         // Estimate gas and execute the transaction
    //         const gasLimit = await contract.estimateGas[functionName](...args);
    //         const tx = await contract[functionName](...args, { gasLimit });
    //         const receipt = await tx.wait();

    //         return { success: true, data: receipt };
    //     } catch (error) {
    //         console.error("Error executing function call:", error);
    //         handleError(error, "Transaction");
    //         return { success: false, error: error.message };
    //     }
    // };

    const approveCall = async (tokenAddress, tokenABI, contractAddress, amount) => {
        if (!provider) return;
        setProcessing(true);

        try {
            // Fetch token decimals dynamically
            const decimals = await getTokenDecimals(tokenAddress, tokenABI);

            // Convert amount to BigNumber using the token's decimals
            const tokenAmountBigNumber = ethers.utils.parseUnits(amount.toString(), decimals);
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();
            const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

            // Check token balance
            const tokenBalance = await tokenContract.balanceOf(signerAddress);
            if (tokenBalance.lt(tokenAmountBigNumber)) {
                setFailed(true);
                setErrorReason("Insufficient token balance.");
                return { success: false };
            }

            // Check and reset allowance if needed
            const currentAllowance = await tokenContract.allowance(signerAddress, contractAddress);
            if (currentAllowance.lt(tokenAmountBigNumber)) {
                if (currentAllowance.gt(0)) {
                    const resetTx = await tokenContract.approve(contractAddress, 0, { gasLimit: 50000 });
                    const resetReceipt = await resetTx.wait();
                    if (resetReceipt.status !== 1) {
                        setFailed(true);
                        setErrorReason("Failed to reset allowance.");
                        return { success: false };
                    }
                }

                // Approve new allowance
                const approveTx = await tokenContract.approve(contractAddress, tokenAmountBigNumber, { gasLimit: 50000 });
                const approveReceipt = await approveTx.wait();
                if (approveReceipt.status !== 1) {
                    setFailed(true);
                    setErrorReason("Token approval transaction failed.");
                    return { success: false };
                }
            }

            setApproveSuccess(true);
            return { success: true };
        } catch (error) {
            console.error("Error in approveCall:", error);
            setFailed(true);
            setErrorReason(error.message);
            return { success: false };
        } finally {
            setProcessing(false);
        }
    };

    const getTokenDecimals = async (tokenAddress, tokenABI) => {
        try {
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

            const decimals = await tokenContract.decimals();
            console.log(`Token Decimals for ${tokenAddress}:`, decimals);
            const usdtAmountBigNumber = Number(decimals)
            console.log(`Token Decimals for ${tokenAddress}:`, usdtAmountBigNumber);

            return decimals;
        } catch (error) {
            console.error("Error fetching token decimals:", error);
            throw new Error("Failed to fetch token decimals.");
        }
    };

    return {
        functionCall,
        approveCall,
        states: {
            processing,
            convertionFailed,
            approveSuccess,
            resetSuccess,
            failed,
            errorReason,
        },
    };
};




// Old executing flow
// import { useState } from "react";
// import { ethers } from "ethers";
// import { constant } from "../config/constant";
// import { usdtABI } from "../config/usdtABI";
// import { useContract } from "../contexts/ContractProvider";
// export const useGeneric = () => {
//     const [processing, setProcessing] = useState(false);
//     const [convertionFailed, setConvertionFailed] = useState(false);
//     const [approveSuccess, setApproveSuccess] = useState(false);
//     const [resetSuccess, setResetSuccess] = useState(false);
//     const [failed, setFailed] = useState(false);
//     const [errorReason, setErrorReason] = useState("");
//     const { contract, provider } = useContract();
//     const handleError = (error, tokenType) => {
//         console.error(`Error with ${tokenType}:`, error);
//         setErrorReason(error.message || "An unknown error occurred.");
//     };
//     const functionCall = async (functionName, params, gasFees) => { // isGas
//         if (!contract) {
//             console.log("Contract not found", gasFees)
//             return;
//         }
//         console.log("value", params);
//         try {
//             // const usdtAmountBigNumber = ethers.utils.parseUnits(value, 6);
//             const args = Object.values(params);
//             console.log("args", args);
//             if (typeof contract[functionName] !== "function") {
//                 throw new Error(`Function ${functionName} does not exist on the contract`);
//             }
//             let res;
//             // if (isGas === true) {
//             console.log("Step1:", gasFees)
//             const gasLimit = await contract?.estimateGas[functionName](...args)
//             // console.log("GAS:", gasLimit)
//             const token = await contract[functionName](...args, { gasLimit: gasLimit });
//             console.log("token:", token)
//             const receipt = await token.wait();
//             console.log("RECEIPT:", receipt)
//             return { data: receipt, isGas: true, success: true };
//             // } else {
//             //     console.log("Step2:", isGas)
//             //     res = await contract[functionName](...args);
//             //     console.log("RES:", res)
//             //     const tokenValue = Number(ethers.utils.formatUnits(res, 6));
//             //     console.log("RES:", res)
//             //     return { data: tokenValue, isGas: false, success: true };
//             // }
//         } catch (error) {
//             console.log("Step3:", error)
//             console.error("Error fetching token value:", error);
//             handleError(error, "USDT");
//             setConvertionFailed(true);
//             return { data: null, isGas: false, success: false };
//         }
//     };
//     const approveCall = async (usdtValue) => {
//         if (!contract || !provider) return;
//         setProcessing(true);
//         try {
//             const usdtAmountBigNumber = ethers.utils.parseUnits(usdtValue, 6);
//             const { usdtAddress, presaleAddress } = constant;
//             const signer = provider.getSigner();
//             const signerAddress = await signer.getAddress();
//             const usdtContract = new ethers.Contract(usdtAddress, usdtABI, signer);
//             const usdtBalance = await usdtContract.balanceOf(signerAddress);
//             if (usdtBalance.lt(usdtAmountBigNumber)) {
//                 // alert("Insufficient USDT balance.");
//                 setFailed(true);
//                 return;
//             }
//             const currentAllowance = await usdtContract.allowance(signerAddress, presaleAddress);
//             if (currentAllowance.lt(usdtAmountBigNumber)) {
//                 if (currentAllowance.gt(0)) {
//                     const resetTx = await usdtContract.approve(presaleAddress, 0, { gasLimit: 100000 });
//                     const resetReceipt = await resetTx.wait();
//                     if (resetReceipt.status === 1) {
//                         setResetSuccess(true);
//                     } else {
//                         // alert("Failed to reset allowance.");
//                         setFailed(true);
//                         return;
//                     }
//                 }
//                 const approveTx = await usdtContract.approve(presaleAddress, usdtAmountBigNumber, { gasLimit: 100000 });
//                 const approveReceipt = await approveTx.wait();
//                 if (approveReceipt.status === 1) {
//                     setApproveSuccess(true);
//                 } else {
//                     setFailed(true);
//                     setErrorReason("USDT approval transaction failed.");
//                     return;
//                 }
//             }
//         } catch (error) {
//             console.error("Error in approveCall:", error);
//             setFailed(true);
//             setErrorReason(error.message);
//         } finally {
//             setProcessing(false);
//         }
//     };
//     return {
//         functionCall,
//         approveCall,
//         states: {
//             processing,
//             convertionFailed,
//             approveSuccess,
//             resetSuccess,
//             failed,
//             errorReason,
//         },
//     };
// };