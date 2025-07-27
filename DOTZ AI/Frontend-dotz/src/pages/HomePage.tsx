import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow z-10 pt-24">
      <div className="container mx-auto px-4">
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 gradient-text"
          >
            Empowering Digital Interactions
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl"
          >
            Explore seamless voice, video, and text interactions powered by cutting-edge AI
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(74, 144, 226, 0.6)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/hub')}
            className="w-60 h-14 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full font-semibold transition-all duration-300 hover:from-[#357ABD] hover:to-[#4A90E2] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2 focus:ring-offset-[#0D1117] relative overflow-hidden group"
          >
            <span className="relative z-10">Try Dotz.ai</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF] to-[#A020F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </section>
      </div>
    </main>
  );
};

export default HomePage;