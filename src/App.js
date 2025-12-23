// import "./App.scss";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
// import Home from "./pages/Home/Home";
// import Services from "./pages/Services/Services";
// import Packages from "./pages/Packages/Packages";
// import Gallery from "./pages/Gallery/Gallery";
// import FAQ from "./pages/FAQ/FAQ";
// import Contact from "./pages/Contact/Contact";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/services" element={<Services />} />
//         <Route path="/packages" element={<Packages />} />
//         <Route path="/gallery" element={<Gallery />} />
//         <Route path="/faq" element={<FAQ />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//       <Footer />
//     </BrowserRouter>
//   );
// }

import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Prelaunch from "./pages/Prelaunch/Prelaunch";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Prelaunch />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
