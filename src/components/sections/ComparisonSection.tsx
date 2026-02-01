import React from 'react';
import ScrollReveal from '../animations/ScrollReveal';
import GlareHover from '../animations/GlareHover';

interface ComparisonSectionProps {
  onStart: () => void;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onStart }) => {
  const features = [
    {
      name: 'All-in-One Workflow',
      crosspostDesc: 'Editing, optimization and publishing in one place',
      otherDesc: 'Multiple separate tools to stitch together',
      crosspost: true,
      other: false
    },
    {
      name: 'Video Editing',
      crosspostDesc: 'Professional editor built into your publishing flow',
      otherDesc: 'Good editors like CapCut, but separate from publishing',
      crosspost: true,
      other: true
    },
    {
      name: 'Multi-Platform Publishing',
      crosspostDesc: 'Publish to every platform from one upload',
      otherDesc: 'Usually focused on a single platform',
      crosspost: true,
      other: false
    },
    {
      name: 'Distribution Engine',
      crosspostDesc: 'Designed for repurposing and distribution',
      otherDesc: 'No built-in distribution system',
      crosspost: true,
      other: false
    },
    {
      name: 'AI Content Adaptation',
      crosspostDesc: 'AI adapts cuts, titles and formats per platform',
      otherDesc: 'Limited or no AI for multi-platform workflows',
      crosspost: true,
      other: false
    },
    {
      name: 'One Dashboard',
      crosspostDesc: 'One place to manage videos and publishing',
      otherDesc: 'Different apps and logins for each step',
      crosspost: true,
      other: false
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mt-32 mb-24 px-4">
      <ScrollReveal delay={200}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-2xl font-black text-black">CrossPost</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.crosspost ? (
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <div className="flex-1">
                      <span className="text-black font-bold text-base block">{feature.name}</span>
                      <span className="text-gray-500 text-sm mt-1 block">{feature.crosspostDesc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 rounded-lg border-2 border-green-500 bg-green-50">
                <p className="text-green-700 font-medium text-sm">Everything you need, ready to use instantly</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h3 className="text-2xl font-black text-black">Other Platforms</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.other ? (
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <div className="flex-1">
                      <span className="text-black font-bold text-base block">{feature.name}</span>
                      <span className="text-gray-500 text-sm mt-1 block">{feature.otherDesc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 rounded-lg border-2 border-red-500 bg-red-50">
                <p className="text-red-700 font-medium text-sm">Hours spent on managing different tools and switching contexts</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default ComparisonSection;
