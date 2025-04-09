import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import ProjectPage from "./pages/ProjectPage";
import SavedPage from "./pages/SavedPage";
import SharedPage from "./pages/SharedPage";
import AchievementPage from "./pages/AchievementPage";
import PortfolioPage from "./pages/PortfolioPage";
import InputsPage from "./pages/InputsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* This div creates space for the fixed sidebar */}
        <div className="hidden md:block md:w-64 flex-shrink-0"></div>

        <div className="flex-grow flex flex-col">
          <Navbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cartCount={cart.length}
          />
          <main className="flex-grow p-0">
            <Routes>
              <Route path="/" element={
                <ProjectPage
                  searchQuery={searchQuery}
                  cart={cart}
                  setCart={setCart}
                />
              } />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/shared" element={<SharedPage />} />
              <Route path="/achievement" element={<AchievementPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/inputs" element={<InputsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
