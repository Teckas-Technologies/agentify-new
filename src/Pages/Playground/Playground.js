import React, { useState, useRef, useEffect } from 'react';
import { LuCodeXml, LuMessageSquareText } from 'react-icons/lu';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { IoIosCloseCircle } from "react-icons/io";
import './Playground.css';

import PlaygroundRight from './Playground-Right';
import LeftPanel from "./LeftPanel";

import FullScreenOverlay from "../../components/FullscreenOverlay/FullscreenOverlay";
import SearchBar from './SearchBar';
import Card from '../../components/Card/Card.tsx';

import Menu from "../../components/Menu/Menu";

const initialCards = [
  {
    id: 1,
    title: 'Decentramind',
    description: 'Suggests decentralized and intelligent operations. You can customize the code and implement it wherever you need to.'
  },
  {
    id: 2,
    title: 'SmartAgentX',
    description: 'Advanced AI agent for smart contract interactions and blockchain operations.'
  },
  {
    id: 3,
    title: 'ChainGenie',
    description: 'Blockchain wizard that helps you navigate complex DeFi operations with ease.'
  },
  {
    id: 4,
    title: 'CryptoHelper',
    description: 'Your personal assistant for cryptocurrency trading and portfolio management.'
  },
  {
    id: 5,
    title: 'NFTMaster',
    description: 'Specialized agent for NFT creation, trading, and collection management.'
  },
  {
    id: 6,
    title: 'DeFiBot',
    description: 'Automated DeFi protocol interaction and yield farming optimization.'
  },
  {
    id: 7,
    title: 'BlockExplorer',
    description: 'Deep insights into blockchain data and transaction analysis.'
  },
  {
    id: 8,
    title: 'TokenTracker',
    description: 'Real-time monitoring and analytics for token performance.'
  },
  {
    id: 9,
    title: 'SmartAudit',
    description: 'Automated smart contract auditing and security analysis.'
  },
  {
    id: 10,
    title: 'GasOptimizer',
    description: 'Intelligent gas fee optimization for blockchain transactions.'
  },
  {
    id: 11,
    title: 'WalletGuard',
    description: 'Secure wallet management and transaction monitoring.'
  },
  {
    id: 12,
    title: 'ChainOracle',
    description: 'Reliable data feeds and oracle services for smart contracts.'
  }
];

function Playground() {

  const [showMenu, setShowMenu] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSwitched, setIsSwitched] = useState(false);

    const [cards, setCards] = useState(initialCards);
    const [searchQuery, setSearchQuery] = useState('');

  const [showAgentSelectModal, setShowAgentSelectModal] = useState(false);

  const onCardSelect = (card) => {
    setSelectedCard(card);
    setIsSwitched(false);
    setShowAgentSelectModal(false);
  };

  const handleSwitch = () => {
    setIsSwitched(!isSwitched);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filteredCards = initialCards.filter(card =>
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase())
      );
      setCards(filteredCards);
    } else {
      setCards(initialCards);
    }
  };

  return (
    <div className="app">

      <div className="agentSelectModal">
        <FullScreenOverlay show={showAgentSelectModal} close={() => setShowAgentSelectModal(false)}>
          <>
            {/* <div className="closeIcon">
            </div> */}
            <div className='agentSelectModalContent' onClick={(e) => e.stopPropagation()}>
              <div className="agent-select-modal-header">
                <h2>Agents</h2>
                <IoIosCloseCircle size={"30px"} onClick={() => setShowAgentSelectModal(false)} />
              </div>
              <div className="agent-select-modal-content">
                <SearchBar className="agent-select-modal-search" onSearch={handleSearch} />
                <div className="agent-select-modal-cards-container">
                  {initialCards.map(card => (
                    <div
                      key={card.id}
                      onClick={() => onCardSelect(card)}
                      className={`card-wrapper ${selectedCard?.id === card.id ? 'selected' : ''}`}
                    >
                      <Card
                        title={card.title}
                        description={card.description}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        </FullScreenOverlay>
      </div>

      <div className="desktop-header">
        <Menu />
      </div>
      <main className="main-content">
        <div className="panels-container">
          <LeftPanel initialCards={initialCards} onClick={() => setShowAgentSelectModal(true)} handleSearch={handleSearch} onCardSelect={onCardSelect} selectedCard={selectedCard} />
          <PlaygroundRight 
            selectedCard={selectedCard}
            isSwitched={isSwitched}
            onSwitch={handleSwitch}
          />
        </div>
      </main>
    </div>
  ) 
}

export default Playground; 