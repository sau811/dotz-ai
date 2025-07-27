import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  accentColor: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  accentColor,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className="w-80 h-52 bg-gray-800 rounded-2xl p-6 flex flex-col items-start justify-between overflow-hidden relative group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: accentColor }}
      />
      
      <Icon
        size={32}
        className="mb-4 transition-colors duration-300"
        style={{ color: accentColor }}
      />
      
      <div className="text-left">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </motion.button>
  );
};

export default ModuleCard