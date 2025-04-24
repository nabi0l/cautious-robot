import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route , Switch} from "react-router-dom";
import Home from "./Pages/Home";
import Settings from "./Pages/Settings";
import Login from './Pages/Login';
import UserChat from "./Pages/UserChat";
import SideBar from "./Pages/SideBar";
import ThemeToggle from "./Componets/ThemeToggle";
import { ThemeProvider } from "./Context/ThemeContext";

import ProtectedRoute from './Componets/ProtectedRoute';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="App">
      <ThemeProvider>
        <Router>
          <div className="flex h-screen overflow-hidden">
            
            <SideBar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          
            <div className="flex-1 flex flex-col min-h-0">
            
              <div className="flex-1 overflow-auto relative">
              
                <div className="absolute top-4 right-4">
                  <ThemeToggle />
                </div>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/user-chat" element={<UserChat />} />
                  <Route path = "/login" element ={<Login/>} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
