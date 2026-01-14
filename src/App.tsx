// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { Checkout } from './components/Checkout';
import { Success } from './components/Success';
// Importe as novas páginas
import { Terms } from './components/Legal/Terms';
import { Privacy } from './components/Legal/Privacy';

const LandingPage = () => (
  <div style={{ backgroundColor: '#059669', minHeight: '100vh' }}>
    <Hero />
    <Features />
    <Pricing />
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        {/* Novas Rotas */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;