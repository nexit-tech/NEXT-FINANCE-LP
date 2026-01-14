// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { Checkout } from './components/Checkout';
import { Success } from './components/Success';
import { Terms } from './components/Legal/Terms';
import { Privacy } from './components/Legal/Privacy';
// Importa o novo Loader
import { LoadingScreen } from './components/LoadingScreen';

const LandingPage = () => (
  <div style={{ backgroundColor: '#059669', minHeight: '100vh' }}>
    <Hero />
    <Features />
    <Pricing />
    <Footer />
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* O Loader fica "por cima" enquanto isLoading for true */}
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      <BrowserRouter>
        {/* O site carrega "escondido" por trás do loader */}
        <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;