import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { closeAuthModal } from '../store/slices/uiSlice';

const AuthModal: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isAuthModalOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1A1F2A] rounded-xl p-8 w-full max-w-md relative"
        >
          <button
            onClick={() => dispatch(closeAuthModal())}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#0D1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#4A90E2]"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-[#0D1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#4A90E2]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-[#0D1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#4A90E2]"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A90E2] text-white rounded-lg py-2 font-medium hover:bg-[#357ABD] transition-colors"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#4A90E2] hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;