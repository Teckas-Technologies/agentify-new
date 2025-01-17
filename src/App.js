import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Features from './Pages/Features/Features'
import Marketplace from './Pages/Marketplace/Marketplace';
import Dashboard from './Pages/Dashboard/Dashboard';

import CreateAgent from './Pages/CreateAgent/CreateAgent';
import EditAgent from './Pages/EditAgent/EditAgent';
import AgentDetails from './Pages/AgentDetails/AgentDetails';

import Playground from './Pages/Playground/Playground';

import NotFound from './Pages/NotFound/NotFound';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        
          
          <Route path="/" element={<Features />} />

          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/create" element={<CreateAgent />} />
          <Route path="/edit-agent" element={<EditAgent />} />
          <Route path="/agent-details" element={<AgentDetails />} />

          <Route path="/playground" element={<Playground />} />
          <Route path="*" element={<NotFound />} />
         
        
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
