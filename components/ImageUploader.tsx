import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  onFileAdd: (file: File) => void;
  onFileRemove: () => void;
  previewSrc: string | null;
  title: string;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-.75M3 16.098l3.057-3.057a4.5 4.5 0 016.364 0l2.121 2.121M15.75 12.75l2.121-2.121a4.5 4.5 0 016.364 0l.707.707" />
  </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileAdd, onFileRemove, previewSrc, title }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileAdd(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileAdd(e.dataTransfer.files[0]);
    }
  }, [onFileAdd]);

  const handleDragEvent = (e: React.DragEvent<HTMLLabelElement>, entering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(entering);
  };

  const uniqueId = `file-upload-${title.replace(/\s+/g, '-')}`;

  if (previewSrc) {
    return (
      <div className="w-full text-center">
        <div className="relative w-full max-w-sm mx-auto h-96 group">
          <img src={previewSrc} alt="Preview" className="w-full h-full object-contain rounded-xl border border-gray-200 bg-white" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-xl flex justify-center items-center">
            <button 
              onClick={onFileRemove} 
              className="text-white bg-black bg-opacity-70 rounded-lg px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <label
        htmlFor={uniqueId}
        className={`w-full max-w-sm h-96 flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ease-in-out
          ${isDragging ? 'border-black bg-gray-200' : 'border-gray-300 bg-white'}`}
        onDrop={handleDrop}
        onDragOver={(e) => handleDragEvent(e, true)}
        onDragEnter={(e) => handleDragEvent(e, true)}
        onDragLeave={(e) => handleDragEvent(e, false)}
      >
        <input id={uniqueId} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        <div className="text-center text-gray-500 pointer-events-none">
          <UploadIcon />
          <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400">PNG, JPG, or WEBP</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;