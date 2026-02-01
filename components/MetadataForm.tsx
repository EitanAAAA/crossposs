
import React, { useState } from 'react';

interface MetadataFormProps {
  title: string;
  description: string;
  hashtags: string;
  onUpdate: (field: string, value: string) => void;
  videoFile?: File | null;
}

const MetadataForm: React.FC<MetadataFormProps> = ({ title, description, hashtags, onUpdate, videoFile }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_URL}/ai/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: {
            title: title || undefined,
            description: description || undefined,
            hashtags: hashtags || undefined
          }
        })
      });
      if (!response.ok) throw new Error('AI generation failed');
      const suggestion = await response.json();
      if (suggestion.title) onUpdate('title', suggestion.title);
      if (suggestion.description) onUpdate('description', suggestion.description);
      if (suggestion.hashtags) onUpdate('hashtags', suggestion.hashtags.join(', '));
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#2d5a52] px-1">Content Details</label>
        <button
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="text-xs font-bold text-[#4a9082] hover:text-[#3d7a6e] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Generate
            </>
          )}
        </button>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[#2d5a52] mb-2 px-1">Post Title</label>
        <input 
          type="text"
          value={title}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="What's this video about?"
          className="w-full summ-input text-gray-800 font-medium placeholder:text-gray-300 shadow-sm"
        />
        <div className="flex justify-end mt-1 px-1">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{title.length} / 100</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[#2d5a52] mb-2 px-1">Caption</label>
        <textarea 
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder="Tell your audience more..."
          rows={4}
          className="w-full summ-input text-gray-800 font-medium placeholder:text-gray-300 shadow-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[#2d5a52] mb-2 px-1">Hashtags</label>
        <input 
          type="text"
          value={hashtags}
          onChange={(e) => onUpdate('hashtags', e.target.value)}
          placeholder="e.g. viral, music, lifestyle"
          className="w-full summ-input text-gray-800 font-medium placeholder:text-gray-300 shadow-sm"
        />
        <p className="mt-2 text-[11px] text-[#4a9082] font-bold uppercase tracking-widest px-1">
          Separate tags with commas
        </p>
      </div>
    </div>
  );
};

export default MetadataForm;
