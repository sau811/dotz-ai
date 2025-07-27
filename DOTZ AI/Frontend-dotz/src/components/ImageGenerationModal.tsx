// ImageGenerationModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wand2 } from 'lucide-react';

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (imageData: string) => void;
}

const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      onGenerate(data.image_data);
      onClose();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div className="bg-[#1A1F2A] rounded-xl p-6 w-full max-w-md relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <Wand2 className="text-[#4A90E2]" size={24} />
            <h2 className="text-2xl font-bold">Generate Image</h2>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg p-3 text-white min-h-[120px] resize-none"
            placeholder="Describe the image..."
          />

          <motion.button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-[#4A90E2] to-[#A020F0] text-white rounded-lg py-3 font-medium"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageGenerationModal;