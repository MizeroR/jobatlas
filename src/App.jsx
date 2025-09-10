import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobAtlasHomepage from "./components/JobAtlasHomepage";
import HomePage from "./components/HomePage";
import GraphViewer from "./components/GraphPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobAtlasHomepage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/graph" element={<GraphViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
