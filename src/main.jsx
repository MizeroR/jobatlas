import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import RevSliderDemo from "./components/App.jsx";
import "./index.css";
// import App from "./App.jsx";

// function RootComponent() {
//   const [showMainApp, setShowMainApp] = useState(false);

//   return (
//     <div>
//       {showMainApp ? (
//         <App />
//       ) : (
//         <RevSliderDemo onComplete={() => setShowMainApp(true)} />
//       )}
//     </div>
//   );
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RevSliderDemo />
  </StrictMode>
);
