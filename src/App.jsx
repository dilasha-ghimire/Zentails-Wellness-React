import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/authentication/Login.jsx";
import History from "./components/History.jsx";
import Homepage from "./components/Homepage.jsx";
import Profile from "./components/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
