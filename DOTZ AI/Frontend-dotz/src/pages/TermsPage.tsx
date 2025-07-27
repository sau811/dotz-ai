import React from 'react';
import { motion } from 'framer-motion';

const TermsPage: React.FC = () => {
  return (
    <main className="flex-grow z-10 pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-[#1A1F2A] rounded-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-6 gradient-text">Terms & Conditions</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Acceptance of Terms</h2>
              <p>By accessing and using dotz.ai, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">2. Use License</h2>
              <p>Permission is granted to temporarily access the materials (information or software) on dotz.ai's website for personal, non-commercial transitory viewing only.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Disclaimer</h2>
              <p>The materials on dotz.ai's website are provided on an 'as is' basis. dotz.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Limitations</h2>
              <p>In no event shall dotz.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on dotz.ai's website.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">5. Revisions</h2>
              <p>The materials appearing on dotz.ai's website could include technical, typographical, or photographic errors. dotz.ai does not warrant that any of the materials on its website are accurate, complete or current.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default TermsPage;