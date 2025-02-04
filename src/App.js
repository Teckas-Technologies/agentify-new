import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
// pages
import Features from './Pages/Features/Features'
import Marketplace from './Pages/Marketplace/Marketplace';
import Dashboard from './Pages/Dashboard/Dashboard';
import CreateAgent from './Pages/CreateAgent/CreateAgent';
import EditAgent from './Pages/EditAgent/EditAgent';
import AgentDetails from './Pages/AgentDetails/AgentDetails';
import Playground from './Pages/Playground/Playground';
import NotFound from './Pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute ';
function App() {
  return (
    <div className="App">
      <Auth0Provider
    domain={"dev-nndolpmecyghhm8z.us.auth0.com"}
    clientId={"Tqbaa3qIoLUVIVXb74p9KlVIizo19RRW"}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "http://localhost:3001",
      scope: "openid profile email"
    }}
  >
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/create" element={ <ProtectedRoute>
                <CreateAgent />
              </ProtectedRoute>} />
          <Route path="/edit-agent" element={ <ProtectedRoute>
                <EditAgent />
              </ProtectedRoute>} />
          <Route path="/agent-details" element={<ProtectedRoute>
                <AgentDetails />
              </ProtectedRoute>} />
          <Route path="/playground" element={<ProtectedRoute>
                <Playground />
              </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </Auth0Provider>
    </div>
  );
}
export default App;