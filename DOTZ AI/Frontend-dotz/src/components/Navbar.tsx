import React, { useState } from 'react';
import { Menu, X, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { openContactForm } from '../store/slices/uiSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.ui.isAuthenticated);

  const logoAnimation = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <nav className="fixed w-full bg-[#0D1117]/90 backdrop-blur-sm z-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={logoAnimation}
          >
            <Brain className="w-8 h-8 text-[#00BFFF]" />
            <span className="text-xl font-montserrat">dotz.ai</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className="hover:text-[#00BFFF] transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about"
              className="hover:text-[#00BFFF] transition-colors"
            >
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/hub"
                  className="hover:text-[#00BFFF] transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {/* Implement logout */}}
                  className="hover:text-[#00BFFF] transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link 
                to="/auth"
                className="hover:text-[#00BFFF] transition-colors"
              >
                Sign In
              </Link>
            )}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(openContactForm())}
              className="neon-button"
            >
              Get in Touch
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#0D1117]/95 backdrop-blur-sm"
          >
            <div className="flex flex-col space-y-4 p-4">
              <Link 
                to="/"
                className="hover:text-[#00BFFF] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about"
                className="hover:text-[#00BFFF] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/hub"
                    className="hover:text-[#00BFFF] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      /* Implement logout */
                      setIsOpen(false);
                    }}
                    className="hover:text-[#00BFFF] transition-colors text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth"
                  className="hover:text-[#00BFFF] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  dispatch(openContactForm());
                  setIsOpen(false);
                }}
                className="neon-button w-full"
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;