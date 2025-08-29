import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import { generateVirtualTryOn } from './services/geminiService';
import Logo from './components/Logo';

// --- UI Components ---

const Header: React.FC = () => (
  <header className="w-full py-8 text-center">
    <Logo />
    <p className="text-lg text-gray-600 mt-2">See yourself in any outfit. Instantly.</p>
  </header>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "font-semibold py-3 px-8 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-800 disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100',
  };
  return <button {...props} className={`${baseClasses} ${variantClasses[variant]}`}>{children}</button>;
};

const loadingMessages = [
  "Styling your new look...",
  "Applying the outfit...",
  "Working our AI magic...",
  "This might take a moment...",
  "Finalizing the details...",
];

const Spinner: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
      <p className="text-gray-600 font-medium text-lg">{message}</p>
    </div>
  );
};

// --- Main App Component ---

interface ImageState {
  file: File | null;
  preview: string | null;
}

const initialState = { file: null, preview: null };

function App() {
  const [personImage, setPersonImage] = useState<ImageState>(initialState);
  const [outfitImage, setOutfitImage] = useState<ImageState>(initialState);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File, setImageState: React.Dispatch<React.SetStateAction<ImageState>>) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageState({ file, preview: reader.result as string });
    };
    reader.readAsDataURL(file);
    setError(null);
  };
  
  const handleReset = (stage: 'person' | 'outfit' | 'full') => {
    if (stage === 'person' || stage === 'full') {
      setPersonImage(initialState);
    }
    if (stage === 'outfit' || stage === 'full') {
        setOutfitImage(initialState);
    }
    setResultImage(null);
    setError(null);
  }

  const handleTryOn = async () => {
    if (!personImage.file || !outfitImage.file) {
      setError("Please upload both images before trying on.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const generatedBase64 = await generateVirtualTryOn(personImage.file, outfitImage.file);
      setResultImage(`data:image/png;base64,${generatedBase64}`);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="w-full flex justify-center items-center min-h-[420px]"><Spinner /></div>;
    }

    if (resultImage) {
      return (
        <div className="w-full flex flex-col items-center space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Here's Your New Look!</h2>
          <div className="max-w-xl w-full rounded-xl shadow-2xl overflow-hidden">
            <img src={resultImage} alt="Generated virtual try-on" className="w-full h-auto" />
          </div>
          <div className="flex items-center space-x-4">
             <a href={resultImage} download="ark-tryout-result.png">
                <Button>Download Image</Button>
            </a>
            <Button onClick={() => handleReset('full')} variant="secondary">Start Over</Button>
          </div>
        </div>
      );
    }

    return (
        <div className="w-full flex flex-col items-center space-y-12">
            {!personImage.preview && (
                <div className="w-full flex flex-col items-center text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Step 1: Upload Your Photo</h2>
                    <ImageUploader 
                        onFileAdd={(file) => handleFileSelect(file, setPersonImage)} 
                        onFileRemove={() => handleReset('person')}
                        previewSrc={personImage.preview} 
                        title="Your Photo"
                    />
                </div>
            )}

            {personImage.preview && (
                 <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-10">
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Photo</h2>
                        <ImageUploader 
                            onFileAdd={(file) => handleFileSelect(file, setPersonImage)} 
                            onFileRemove={() => handleReset('person')}
                            previewSrc={personImage.preview} 
                            title="Your Photo"
                        />
                    </div>
                     <div className="flex flex-col items-center text-center">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Step 2: Upload Outfit</h2>
                         <ImageUploader 
                            onFileAdd={(file) => handleFileSelect(file, setOutfitImage)} 
                            onFileRemove={() => handleReset('outfit')}
                            previewSrc={outfitImage.preview} 
                            title="Outfit Photo"
                        />
                    </div>
                 </div>
            )}
            
            {personImage.file && outfitImage.file && (
                <div className="text-center">
                    <Button onClick={handleTryOn} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate Try-On'}
                    </Button>
                </div>
            )}
            
            {error && <p className="text-red-600 mt-4 font-medium text-center">{error}</p>}
        </div>
    );
  };
  
  return (
    <div className="min-h-screen text-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
        <Header />
        <main className="w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;