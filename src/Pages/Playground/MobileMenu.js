import React from 'react';
import './MobileMenu.css';

function MobileMenu() {
  return (
    <div className="mobile-menu">
      <div className="mobile-menu-links">
        <a href="#features">Features</a>
        <a href="#marketplace">Marketplace</a>
        <a href="#create">Create Agent</a>
        <a href="#playground">Playground</a>
      </div>
      <button className="connect-wallet">Connect Wallet →</button>
    </div>
  );
}

export default MobileMenu; 