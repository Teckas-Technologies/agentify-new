import React, { useState, useRef, useEffect } from 'react';
import { LuCodeXml, LuMessageSquareText, LuTrash, LuMessageSquareX } from 'react-icons/lu';
import { FiCopy } from 'react-icons/fi';
import './Playground-Right.css';
import useChatHooks from '../../Hooks/useChatHook';
import { useAccount } from 'wagmi';
import { useGeneric } from '../../Hooks/useGeneric';
import { useAuth0 } from '@auth0/auth0-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import useSwapHook from '../../Hooks/useSwapHook';

function PlaygroundRight({ selectedCard, isSwitched, onSwitch }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [threadId, setThreadId] = useState('');
  const { loading, error, fetchChat, fetchChatHistory, clearHistory } = useChatHooks();
  const [isTyping, setIsTyping] = useState(false);
  const { address, isConnected } = useAccount();
  const { approveCall, functionCall } = useGeneric();
  const [isCreating, setIsCreating] = useState(false);
  const [executing, setExecuting] = useState(false);
  const { isLoading, isAuthenticated, user, logout } = useAuth0();
  const { executeSwap } = useSwapHook();

  // console.log("User:", user)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async (selectedCard) => {
    if (!user || !selectedCard) return;
    const res = await fetchChatHistory(user?.sub?.split("|")[1], selectedCard)
    console.log("History:", res);
    if (res?.success) {
      const formattedMessages = res?.threads
        ?.filter(thread => thread?.message?.trim() !== "")
        .map(thread => ({
          sender: thread?.role === "human" ? "user" : "bot",
          text: thread?.message
        }));

      // Update state with formatted messages
      setMessages(formattedMessages || []);
    }
  }

  const clearChat = async () => {
    if (!user || !selectedCard) return;
    const res = await clearHistory(user?.sub?.split("|")[1], selectedCard);
    console.log("Cleared History:", res);
    setMessages([]);
  }

  useEffect(() => {
    if (selectedCard) {
      fetchHistory(selectedCard);
      setThreadId(selectedCard);
    }
  }, [selectedCard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      setIsTyping(true);
      console.log("SEL CARD;", selectedCard)
      if (!selectedCard || !user) return;
      try {
        const response = await fetchChat({
          message: inputValue,
          agentName: selectedCard,  // selectedCard?.agentName || "Uniswap Agent New",
          userId: user?.sub?.split("|")[1],
          walletAddress: address,
          threadId: selectedCard // agent_id replace
        });

        console.log("RES:", response)

        // const response = {
        //   data: {
        //     intent: "final_json",
        //     meta_data: {
        //       contract: "0xed72346f59241D1A8E043f1dd60E2967D9baB90C",
        //       functionName: "contributeUSDT",
        //       isGas: true,
        //       gasLimit: "500000",
        //       parameters: {
        //         amount: "500000"
        //       }
        //     }
        //   }
        // }

        // const response = {
        //   "data": {
        //     "intent": "final_json",
        //     "meta_data": {
        //       "contract": "0xF62c03E08ada871A0bEb309762E260a7a6a880E6",
        //       "functionName": "createExchange",
        //       "isGas": true,
        //       "gasLimit": "500000",
        //       "parameters": {
        //         "token": "0x0EC435037161ACd3bB94eb8DF5BC269f17A4E1b9"
        //       }
        //     }
        //   }
        // }

        // const response = {
        //   "data": {
        //     "intent": "final_json",
        //     "meta_data": {
        //       "contract": "0xF62c03E08ada871A0bEb309762E260a7a6a880E6",
        //       "functionName": "createPair",
        //       "isGas": true,
        //       "gasLimit": "500000",
        //       "parameters": {
        //         "tokenA": "0x5E2F8dfD0E05833f0DD88aFFe71414d08B698D2B",
        //         "tokenB": "0x0EC435037161ACd3bB94eb8DF5BC269f17A4E1b9"
        //       }
        //     }
        //   }
        // }

        // working
        // const response = {
        //   "data": {
        //     "intent": "final_json",
        //     "meta_data": {
        //       "contract": "0xF62c03E08ada871A0bEb309762E260a7a6a880E6",
        //       "functionName": "allPairs",
        //       "isGas": false,
        //       "parameters": {
        //         "_index": "0"
        //       }
        //     }
        //   }
        // }

        if (response) {
          console.log("RES:", response)
          if (response?.tool_response !== "None") {  //  if (response.data.intent === "final_json")

            const quote = JSON.parse(response?.tool_response);

            console.log("Quote:", quote)

            if(quote?.error === "Failed to fetch quote.") {
              setMessages((prev) => [...prev, { sender: "bot", text: `Can't fetch the quote at this time. Try again later!` }]);
              return;
            }

            if (quote) {
              setMessages((prev) => [...prev, { sender: "bot", text: `Executing swap, don't close the page until get confirmations...` }]);
              setExecuting(true);
              const response = await executeSwap({ quote });
              console.log("Res:", response);
              if (response?.txHash) {
                setMessages((prev) => [...prev, { sender: "bot", text: `${quote?.action?.fromChainId.toString() === quote?.action?.toChainId.toString() ? "Swap" : "Bridge"} executed successfully! [Status](https://etherscan.io/tx/${response?.txHash})` }]);
                setExecuting(false);
                return;
              } else {
                setMessages((prev) => [...prev, { sender: "bot", text: `${quote?.action?.fromChainId.toString() === quote?.action?.toChainId.toString() ? "Swap" : "Bridge"} execution was failed!` }]);
                setExecuting(false);
                return;
              }
            }
          }

          setThreadId(response.threadId);
          setMessages(prevMessages => [...prevMessages, { text: response.ai_message, sender: 'bot' }]);
        }
      } catch (err) {
        console.error("Chat error:", err);

        if (err.message?.includes("User denied transaction signature") || err.name === "UserRejectedRequestError") {
          setMessages((prev) => [...prev, { sender: "bot", text: `The transaction was rejected.` }]);
        } else if (err.name === "BalanceError" || err.message?.includes("balance is too low")) {
          setMessages((prev) => [...prev, { sender: "bot", text: `Insufficient balance. Please check your wallet and try again.` }]);
        } else if (err.name === "TransactionExecutionError") {
          setMessages((prev) => [...prev, { sender: "bot", text: `Transaction execution failed. Please try again.` }]);
        } else {
          setMessages((prev) => [...prev, { sender: "bot", text: `Something went wrong. Try again later!` }]);
        }

      } finally {
        setIsTyping(false);
        setExecuting(false);
      }
    }
  };

  console.log("MSGS:", messages)

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  // const getCardText = (card) => {
  //   return `Title: ${card.agentName}\nDescription: ${card.agentPurpose}\nCode: ${card.codeSnippet}`;
  // };

  const getCardText = (card) => (
    <>
      <span style={{ color: "#ffffff" }}> Title: </span> {card}
      <br />
      <span style={{ color: "#ffffff" }}> Description: </span> {card === "Swap Agent" ? "This agent will help users to swap their tokens on the same chain." : "This agent will help users to swap/bridge their tokens on the cross chain."}
      <br />
      <br />
      <span style={{ color: "#ffffff" }}> Code Snippet: <br /> </span>{card?.codeSnippet || "Null"}
    </>
  );

  <div className="code-text">{getCardText(selectedCard)}</div>;


  return (
    <div className="playground">
      <div className="playground-header">
        <h2>{isSwitched ? 'Embeddable Code' : 'Playground'}</h2>
        <div className="switch-container">
          <span className='switch'>Switch to</span>
          <button
            className="switch-icon-btn"
            onClick={onSwitch}
            title={isSwitched ? "Switch to chat" : "Switch to code"}
          >
            {isSwitched ? <LuMessageSquareText size={20} /> : <LuCodeXml size={20} />}
          </button>
          <button
            className="switch-icon-btn"
            onClick={clearChat}
          >
            <LuMessageSquareX size={20} />
          </button>
        </div>
      </div>

      <div className="playground-content">
        {isSwitched && selectedCard ? (
          <div className="code-content">
            <div className="code-text">
              {getCardText(selectedCard)}
            </div>
            <button
              className="copy-button"
              onClick={() => handleCopy(selectedCard?.codeSnippet)}
              title="Copy to clipboard"
            >
              <FiCopy size={16} />
            </button>
          </div>
        ) : (
          <>
            {messages.length === 0 && <div className="playground-title">Execute Transactions with AI</div>}
            <div className="messages-container">
              {messages.map((message, index) => {
                const isLastMessage = index === messages.length - 1; // Check if it's the last message
                return (
                  <div key={index} className={`message ${message?.sender}`}>
                    <div className={`message-content ${isLastMessage && message.sender === "bot" && message?.text?.includes("Executing") && executing ? "dflex" : ""}`}>
                      {isLastMessage && message.sender === "bot" && message?.text?.includes("Executing") && executing && (
                        <div className="loader"></div>
                      )}
                      {/* <p dangerouslySetInnerHTML={{ __html: message.text }}></p> */}
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="message bot typing-indicator">
                  <div className="message-content">
                    <span>Agent is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="input-container">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message smart actions"
                  className="message-input"
                />
                <button type="submit" className="send-button">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3333 1.66667L9.16667 10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.3333 1.66667L12.5 18.3333L9.16667 10.8333L1.66667 7.5L18.3333 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default PlaygroundRight; 