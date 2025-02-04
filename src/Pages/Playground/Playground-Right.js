import React, { useState, useRef, useEffect } from 'react';
import { LuCodeXml, LuMessageSquareText } from 'react-icons/lu';
import { FiCopy } from 'react-icons/fi';
import './Playground-Right.css';
import useChatHooks from '../../Hooks/useChatHook';
import { useAccount } from 'wagmi';
import { useGeneric } from '../../Hooks/useGeneric';
import { useAuth0 } from '@auth0/auth0-react';

function PlaygroundRight({ selectedCard, isSwitched, onSwitch }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [threadId, setThreadId] = useState('');
  const { loading, error, fetchChat } = useChatHooks();
  const [isTyping, setIsTyping] = useState(false);
  const { address, isConnected } = useAccount();
  const { funcCall, getfuncTokenValue } = useGeneric();
  const [isCreating, setIsCreating] = useState(false);
  const { isLoading, isAuthenticated, user, logout } = useAuth0();

  // console.log("User:", user)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedCard) {
      setMessages([]);
      setThreadId(selectedCard._id);
    }
  }, [selectedCard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      setIsTyping(true);
      console.log("SEL CARD;", selectedCard)
      try {
        const response = await fetchChat({
          message: inputValue,
          agentName: selectedCard?.agentName || "MYID Token Presale",
          userId: user?.sub,
          walletAddress: address,
          threadId: selectedCard?._id // agent_id replace
        });
        if (response) {
          console.log("RES:", response)
          // if (response.data.intent === "final_json") {
          //   const metaData = response.data.meta_data;
          //   if (!address || !isConnected) {
          //     return;
          //   }

          //   const { contract, functionName, gasLimit, parameters } = metaData;
          //   console.log(functionName, gasLimit, parameters)

          //   if (!address || (address.trim().startsWith("0x") && address.trim().length !== 42)) {
          //     return;
          //   }

          //   setMessages((prev) => [...prev, { sender: "bot", text: `Executing function: ${functionName}...` }]);
          //   setIsCreating(true);

          //   const res = await getfuncTokenValue(functionName, parameters, gasLimit);
          //   console.log(res);

          //   if (res?.success) {
          //     if (res?.isGas) {
          //       const txData = res.data;
          //       setMessages((prev) => [...prev, { sender: "bot", text: `Function call executed successfully! <span hidden>${txData.transactionHash}</span>` }]);
          //     } else {
          //       setMessages((prev) => [...prev, { sender: "bot", text: String(res?.data) }]);
          //     }
          //   } else {
          //     setMessages((prev) => [...prev, { sender: "bot", text: "Function call execution failed!" }]);
          //   }

          //   setIsCreating(false);
          // }

          setThreadId(response.threadId);
          setMessages(prevMessages => [...prevMessages, { text: response.agentResponse, sender: 'bot' }]);
        }
      } catch (err) {
        console.error("Chat error:", err);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  // const getCardText = (card) => {
  //   return `Title: ${card.agentName}\nDescription: ${card.agentPurpose}\nCode: ${card.codeSnippet}`;
  // };

  const getCardText = (card) => (
    <>
      <span style={{color: "#ffffff"}}> Title: </span> {card?.agentName}
      <br />
      <span style={{color: "#ffffff"}}> Description: </span> {card?.agentPurpose}
      <br />
      <br />
      <span style={{color: "#ffffff"}}> Code Snippet: <br /> </span>{card?.codeSnippet}
    </>
  );
  
  <div className="code-text">{getCardText(selectedCard)}</div>;
  

  return (
    <div className="playground">
      <div className="playground-header">
        <h2>{isSwitched ? 'Embeddable Code' : 'Playground'}</h2>
        <div className="switch-container">
          <span>Switch to</span>
          <button
            className="switch-icon-btn"
            onClick={onSwitch}
            title={isSwitched ? "Switch to chat" : "Switch to code"}
          >
            {isSwitched ? <LuMessageSquareText size={20} /> : <LuCodeXml size={20} />}
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
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <div className="message-content">
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message bot typing-indicator">
                  <div className="message-content">
                    <span>Bot is typing...</span>
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