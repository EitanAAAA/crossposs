import React from 'react';
import { PLATFORM_CONFIGS } from '../../constants';
import { Platform } from '../../types';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Platforms', href: '#platforms' },
      { label: 'How It Works', href: '#how-it-works' }
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API', href: '#api' },
      { label: 'Blog', href: '#blog' },
      { label: 'Support', href: '#support' }
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' }
    ]
  };

  return (
    <footer className="w-full border-t border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-black">CrossPost</h3>
            </div>
            <p className="text-gray-600 font-medium mb-6 max-w-md">
              Upload once, publish everywhere. The all-in-one platform for creators who value their time.
            </p>
            <div className="flex items-center gap-3">
              {Object.entries(PLATFORM_CONFIGS).slice(0, 6).map(([platform, config]) => (
                <div
                  key={platform}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center group cursor-pointer"
                  title={platform}
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-[#4a9082] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {config.icon}
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black text-black mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-600 font-medium hover:text-[#4a9082] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black text-black mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-600 font-medium hover:text-[#4a9082] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black text-black mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-600 font-medium hover:text-[#4a9082] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 font-medium text-sm">
            © {currentYear} CrossPost. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-gray-600 font-medium text-sm hover:text-[#4a9082] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-gray-600 font-medium text-sm hover:text-[#4a9082] transition-colors"
            >
              Terms of Service
            </a>
            <div className="flex items-center gap-3">
              <a
                href="#twitter"
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center group"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 text-gray-600 group-hover:text-[#4a9082] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#linkedin"
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center group"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 text-gray-600 group-hover:text-[#4a9082] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

