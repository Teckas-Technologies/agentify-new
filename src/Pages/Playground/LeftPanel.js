import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { FaChevronDown } from "react-icons/fa";


import Card from "../../components/Card/Card.tsx";
import './LeftPanel.css';

import decentramizedLogo from "../../assets/cardLogos/decentramind.svg"

// Mock data for initial cards

function LeftPanel({ initialCards, onCardSelect, selectedCard, handleSearch, onClick }) {

  useEffect(() => {
    onCardSelect(initialCards[0]);
  }, []);

  return (
    <div className="left-panel">
      <div className="left-panel-header">
        <h2>Agents</h2>
      </div>
      <div className="left-panel-content">
        <SearchBar onSearch={handleSearch} />
        <div className="cards-container">
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
        <div className="mobile-cards-container" onClick={onClick}>
          <div className="selectedCard">
            <div className="left">
              <span className="icon">
                <img src={decentramizedLogo} /> {/* instead of hardcoding the icon, it should come from the 'cards' array, which will contain id, title and agent logo url. */}
              </span>
              <span className="title">{selectedCard?.title}</span>
            </div>
            <div className="right">
              <FaChevronDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftPanel; 