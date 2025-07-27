import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Video, Link as LinkIcon } from 'lucide-react';
import ModuleCard from '../components/ModuleCard';

const modules = [
  {
    title: 'Chat',
    description: 'Engage in natural conversations with our advanced AI',
    icon: MessageSquare,
    path: '/chat',
    accentColor: '#4A90E2',
  },
  {
    title: 'Voice',
    description: 'Seamless voice interactions with real-time responses',
    icon: Mic,
    path: '/voice',
    accentColor: '#A020F0',
  },
  {
    title: 'Video',
    description: 'Face-to-face communication enhanced by AI',
    icon: Video,
    path: '/video',
    accentColor: '#1ABC9C',
  },
];

const HubPage: React.FC = () => {
  const navigate = useNavigate();


  return (
    <main className="flex-grow z-10 pt-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
        >
          Choose Your Interaction Method
        </motion.h2>

        {/* Module Selection */}
        <section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-7xl mx-auto"
          role="region"
          aria-label="Available Modules"
        >
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <ModuleCard
                {...module}
                onClick={() => navigate(module.path)}
              />
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default HubPage;
