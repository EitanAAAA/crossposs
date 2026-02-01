import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

import { IconCloudDemo } from './IconCloudDemo';

interface FAQSectionProps {
  onStart: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ onStart }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'Can I edit videos here like in TikTok or CapCut?',
      answer: 'Yes! Our professional video editor includes everything you need: music library, effects, filters, trimming, text overlays, captions, and more. No need to use TikTok or CapCut editors — edit everything in one place and publish to all platforms automatically.'
    },
    {
      question: 'Do I need to use TikTok or CapCut editors?',
      answer: 'No! CrossPost is a complete video editing and publishing solution. You can edit your videos with our professional tools (music, effects, filters, trimming) and then publish to TikTok, YouTube, Instagram, and more — all without leaving the app.'
    },
    {
      question: 'What editing features do you have?',
      answer: 'Our editor includes: music library (licensed, safe for all platforms), effects and filters, video trimming and splitting, text overlays and captions, speed control (slow motion, time-lapse), color grading, and multi-format preview (see how your video looks on all platforms simultaneously).'
    },
    {
      question: 'How does cross-posting work?',
      answer: 'Simply edit your video once in our editor, and our AI automatically adapts it for each platform. We handle aspect ratios, titles, descriptions, and hashtags. Then publish to all your connected platforms with one click.'
    },
    {
      question: 'Which platforms are supported?',
      answer: 'We support YouTube Shorts, TikTok, Instagram Reels, Facebook Reels, X (Twitter), and LinkedIn. We\'re constantly adding new platforms based on user demand.'
    },
    {
      question: 'Do I need separate accounts for each platform?',
      answer: 'Yes, you\'ll need accounts on the platforms you want to publish to. We connect to your existing accounts via secure OAuth, so you don\'t need to share passwords.'
    },
    {
      question: 'How does AI content adaptation work?',
      answer: 'Our AI analyzes your video content and automatically generates platform-optimized titles, descriptions, and hashtags. YouTube gets SEO-focused titles, TikTok gets catchy short captions, and Instagram gets hashtag-optimized content.'
    },
    {
      question: 'What video formats are supported?',
      answer: 'We support all major video formats including MP4, MOV, AVI, and more. We also support audio files like MP3 and WAV for platforms that allow audio-only content.'
    },
    {
      question: 'Is my content secure?',
      answer: 'Absolutely. We use industry-standard encryption and secure OAuth connections. Your videos are processed securely and we never store your platform passwords.'
    },
    {
      question: 'How much time does this save?',
      answer: 'Most creators save 10-15 hours per week. Instead of editing in TikTok, then CapCut, then manually uploading to 6 platforms with different edits, you can edit once and publish everywhere automatically — all in one place.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-7xl mb-24 px-4 mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 50}>
              <div
                className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                style={{
                  transform: openIndex === index ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left group"
                >
                  <h3 className="text-xl font-black text-black flex-1 group-hover:text-[#4a9082] transition-colors">
                    {faq.question}
                  </h3>
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-white transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: openIndex === index ? '500px' : '0px',
                    opacity: openIndex === index ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-5">
                    <div
                      className="pt-0 text-lg font-medium leading-relaxed"
                      style={{
                        color: '#636e72',
                        transform: openIndex === index ? 'translateY(0)' : 'translateY(-10px)',
                        transition: 'transform 0.3s ease-out 0.1s',
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <ScrollReveal delay={400}>
          <p className="text-lg mb-6" style={{ color: '#636e72' }}>
            <span className="font-bold" style={{ color: '#1a1a1a' }}>Still have questions?</span> Contact our support team or start your free trial.
          </p>
          <button
            onClick={onStart}
            className="summ-button px-10 py-5 rounded-2xl font-extrabold text-xl flex items-center gap-3 group hover:scale-[1.02] transition-all mx-auto"
          >
            Start Editing Now
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default FAQSection;





