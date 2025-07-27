import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, Mic, Video } from 'lucide-react';
import bhagavathPhoto from '../../src/images/bag.jpeg'; // Assuming bag.jpeg is in the same folder
import sauhandikaaPhoto from '../../src/images/sau.jpeg';

const AboutSection: React.FC = () => {
  const founders = [
    {
      name: 'R Bhagavath Narenthranath',
      photo: bhagavathPhoto,
      role: 'Co-founder & CEO',
      bio: 'Visionary leader with expertise in AI and machine learning, driving innovation in human-computer interaction.',
    },
    {
      name: 'Sauhandikaa S',
      photo: sauhandikaaPhoto,
      role: 'Co-founder & CTO',
      bio: 'Technical pioneer specializing in natural language processing and real-time communication systems.',
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'Advanced Chat',
      description: 'Natural language processing for human-like conversations and real-time responses.',
    },
    {
      icon: Mic,
      title: 'Voice Intelligence',
      description: 'State-of-the-art voice recognition and synthesis for seamless audio interactions.',
    },
    {
      icon: Video,
      title: 'Smart Video',
      description: 'Real-time video processing with AI-enhanced communication capabilities.',
    },
  ];

  return (
    <main className="flex-grow z-10 pt-24">
      <div className="container mx-auto px-4">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <Brain className="w-16 h-16 text-[#00BFFF]" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">About dotz.ai</h1>
          <p className="text-xl text-gray-300 mb-12">
            dotz.ai is a cutting-edge virtual assistant platform that revolutionizes human-computer interaction through advanced AI technology. Our mission is to make digital communication more natural, efficient, and accessible through voice, video, and chat capabilities.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#1A1F2A] rounded-xl p-6"
              >
                <feature.icon className="w-12 h-12 mb-4 text-[#00BFFF]" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder) => (
              <motion.div
                key={founder.name}
                whileHover={{ scale: 1.02 }}
                className="bg-[#1A1F2A] rounded-xl p-6 flex flex-col items-center"
              >
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-2">{founder.name}</h3>
                <p className="text-[#00BFFF] mb-4">{founder.role}</p>
                <p className="text-gray-400 text-center">{founder.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Ready to Experience the Future?</h2>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,191,255,0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#4A90E2] text-white px-8 py-3 rounded-full font-medium hover:bg-[#357ABD] transition-colors"
            onClick={() => window.location.href = '/hub'}
          >
            Try Dotz.ai Now
          </motion.button>
        </motion.section>
      </div>
    </main>
  );
};

export default AboutSection;