import React, { useState, useRef, useEffect } from 'react';
import { LuCodeXml, LuMessageSquareText } from 'react-icons/lu';
import { FiCopy } from 'react-icons/fi';
import './Playground-Right.css';

function PlaygroundRight({ selectedCard, isSwitched, onSwitch }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getCardText = (card) => {
    return `Title: ${card.title}\nDescription: ${card.description}`;
  };

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
              onClick={() => handleCopy(getCardText(selectedCard))}
              title="Copy to clipboard"
            >
              <FiCopy size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="playground-title">Execute Transactions with AI</div>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <div className="message-content">
                    {message.text}
                  </div>
                </div>
              ))}
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
                    <path d="M18.3333 1.66667L9.16667 10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 1.66667L12.5 18.3333L9.16667 10.8333L1.66667 7.5L18.3333 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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