import React, { useState, useRef, useEffect } from 'react';
import { LuCodeXml, LuMessageSquareText } from 'react-icons/lu';
import { FiMenu } from 'react-icons/fi';
import './Playground.css';

import MobileMenu from "./MobileMenu";
import PlaygroundRight from './Playground-Right';
import LeftPanel from "./LeftPanel";

import Menu from "../../components/Menu/Menu";

function Playground() {

  const [showMenu, setShowMenu] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSwitched, setIsSwitched] = useState(false);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setIsSwitched(false);
  };

  const handleSwitch = () => {
    setIsSwitched(!isSwitched);
  };

  return (
    <div className="app">
      <div className="desktop-header">
        <Menu />
      </div>
      
      {/* <div className="mobile-header">
        <button className="hamburger-menu" onClick={() => setShowMenu(!showMenu)}>
          <FiMenu size={24} />
        </button>
      </div>

      {showMenu && <MobileMenu />} */}

      <main className="main-content">
        <div className="panels-container">
          <LeftPanel onCardSelect={handleCardSelect} selectedCard={selectedCard} />
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