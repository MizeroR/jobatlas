import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import GraphViewer from "./components/GraphPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/graph" element={<GraphViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
