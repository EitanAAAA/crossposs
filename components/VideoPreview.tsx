
import React from 'react';

interface VideoPreviewProps {
  file: File | null;
  onFileChange: (file: File) => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ file, onFileChange }) => {
  const [isAudio, setIsAudio] = React.useState(false);
  const videoUrl = React.useMemo(() => {
    if (!file) return null;
    setIsAudio(file.type.startsWith('audio/'));
    return URL.createObjectURL(file);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="aspect-[9/16] w-full bg-[#fffdf5] relative flex items-center justify-center rounded-3xl border-4 border-dashed border-[#fef3c7]">
        {videoUrl ? (
          isAudio ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-gray-800">
              <div className="w-20 h-20 bg-[#f8d902] rounded-full flex items-center justify-center mb-6 shadow-xl">
                <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
              <p className="text-xl font-extrabold text-black">Audio Source</p>
              <p className="text-sm text-gray-500 mt-2">Converting to social-ready video...</p>
              <audio src={videoUrl} controls className="mt-12 w-full" />
            </div>
          ) : (
            <video 
              src={videoUrl} 
              className="h-full w-full object-cover rounded-2xl" 
              controls 
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center group cursor-pointer" onClick={() => (document.getElementById('file-input') as HTMLInputElement)?.click()}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-110 border-2 border-[#fef3c7]">
              <svg className="w-8 h-8 text-[#f8d902]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-lg font-extrabold text-[#2d3436] mb-1">Click to select</p>
            <p className="text-sm text-gray-400 font-medium">MP4, MOV, or Audio files</p>
            
            <input 
                id="file-input"
                type="file" 
                className="hidden" 
                accept="video/mp4,video/quicktime,audio/mpeg,audio/wav" 
                onChange={handleFileChange} 
            />
          </div>
        )}
      </div>
      
      {file && (
        <div className="mt-4 text-center">
          <label className="text-[#4a9082] text-sm font-bold cursor-pointer hover:text-[#f8d902]">
            Replace current file
            <input 
              type="file" 
              className="hidden" 
              accept="video/mp4,video/quicktime,audio/mpeg,audio/wav" 
              onChange={handleFileChange} 
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
