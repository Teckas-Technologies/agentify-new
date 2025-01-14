import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Features from './Pages/Features/Features'
import Marketplace from './Pages/Marketplace/Marketplace';

import NotFound from './Pages/NotFound/NotFound';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        
          
          <Route path="/" element={<Features />} />
          <Route path="/marketplace" element={<Marketplace />} />

          <Route path="*" element={<NotFound />} />
         
        
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
