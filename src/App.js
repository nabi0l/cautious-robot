import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./Componets/Header";
import Footer from "./Componets/Footer";

import Home from "./Pages/Home";
import SideBar from "./Pages/SideBar";
import Settings from "./Pages/Settings";
import SignIn from "./Pages/SignIn";
import UserChat from "./Pages/UserChat";
import BotChat from "./Pages/BotChat";
import ChatHistory from "./Pages/ChatHistory";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sidebar" element={<SideBar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/user-chat" element={<UserChat />} />
          <Route path="/bot-chat" element={<BotChat />} />
          < Route path="chat/:id" element={<ChatHistory/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
