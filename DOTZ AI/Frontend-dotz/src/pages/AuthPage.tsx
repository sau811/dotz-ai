import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
  };

  return (
    <main className="flex-grow z-10 pt-24">
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1F2A] rounded-xl p-8 w-full max-w-md relative overflow-hidden"
        >
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/10 to-[#A020F0]/10" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <h2 className="text-3xl font-bold mb-2 gradient-text">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 mb-6">
              {isSignUp
                ? 'Join dotz.ai to experience the future of AI interaction'
                : 'Sign in to continue your AI journey'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Name
                    </label>
                    <motion.div
                      variants={inputVariants}
                      whileFocus="focus"
                      className="relative"
                    >
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-[#0D1117] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition-all duration-200"
                        placeholder="Enter your name"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <motion.div
                  variants={inputVariants}
                  whileFocus="focus"
                  className="relative"
                >
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </motion.div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <motion.div
                  variants={inputVariants}
                  whileFocus="focus"
                  className="relative"
                >
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formState.password}
                    onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-lg pl-10 pr-12 py-2 text-white focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(74, 144, 226, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-lg py-3 font-medium transition-all duration-300 hover:from-[#357ABD] hover:to-[#4A90E2]"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#4A90E2] hover:text-[#357ABD] font-medium transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </motion.button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default AuthPage;