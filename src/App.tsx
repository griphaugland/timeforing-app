import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Previous from "./components/pages/Previous";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/previous" element={<Previous />} />
      </Routes>
    </Router>
  );
}
