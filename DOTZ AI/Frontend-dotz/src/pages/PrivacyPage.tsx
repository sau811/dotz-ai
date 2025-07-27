import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage: React.FC = () => {
  return (
    <main className="flex-grow z-10 pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-[#1A1F2A] rounded-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-6 gradient-text">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect dotz.ai and our users.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Information Sharing</h2>
              <p>We do not share your personal information with companies, organizations, or individuals outside of dotz.ai except in the following cases: with your consent, for legal reasons, or as part of a business transfer.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Data Security</h2>
              <p>We work hard to protect dotz.ai and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">5. Your Rights</h2>
              <p>You have the right to access, update, or delete your information at any time. You can also object to our processing of your information or ask us to restrict processing in certain circumstances.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default PrivacyPage;