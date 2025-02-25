import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/authentication/Login.jsx";
import Homepage from "./components/Homepage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;
