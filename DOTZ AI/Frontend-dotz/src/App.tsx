// App.tsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Video } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import ModuleCard from './components/ModuleCard';
import ChatModule from './modules/ChatModule';
import VoiceModule from './modules/VoiceModule';
import VideoModule from './modules/VideoModule';
import AboutSection from './components/AboutSection';
import AuthModal from './components/AuthModal';
import ContactForm from './components/ContactForm';
import HomePage from './pages/HomePage';
import HubPage from './pages/HubPage';
import AuthPage from './pages/AuthPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0D1117]">
      <Navbar />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground />
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hub" element={<HubPage />} />
        <Route path="/chat" element={<ChatModule />} />
        <Route path="/voice" element={<VoiceModule />} />
        <Route path="/video" element={<VideoModule />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>

      <ContactForm />
      <AuthModal />
      <Footer />
    </div>
  );
}

export default App;