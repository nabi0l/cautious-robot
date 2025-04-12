import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SideBar from "./Pages/SideBar";
import Settings from "./Pages/Settings";
import SignIn from "./Pages/SignIn";
import UserChat from "./Pages/UserChat";
import BotChat from "./Pages/BotChat";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sidebar" element={<SideBar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/user-chat" element={<UserChat />} />
          <Route path="/bot-chat" element={<BotChat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
