import logo from './logo.svg';
import './App.css';
import Features from './Pages/Features/Features'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        
          
          <Route path="/" element={<Features />} />
         
        
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
