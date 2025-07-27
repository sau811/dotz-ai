// Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-800 fixed bottom-0 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <Link
              to="/terms"
              className="text-gray-400 hover:text-[#00BFFF] transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-[#00BFFF] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00BFFF] transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00BFFF] transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00BFFF] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          <div className="text-sm text-gray-400">
            © 2024 dotz.ai. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;