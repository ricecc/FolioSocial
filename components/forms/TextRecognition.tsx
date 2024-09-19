import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

interface TextRecognitionProps {
  selectedImage: string;
  onTextRecognized: (recognizedText: string) => void;
  language: string
}

const TextRecognition: React.FC<TextRecognitionProps> = ({ selectedImage, onTextRecognized, language }) => {
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage) {
        setLoading(true);
        setError(null);

        try {
          const result = await Tesseract.recognize(selectedImage, language, {
            logger: info => console.log(info),
          });
          setRecognizedText(result.data.text);
          onTextRecognized(result.data.text);
        } catch (err) {
          setError('An error occurred while recognizing the text.');
        } finally {
          setLoading(false);
        }
      }
    };

    recognizeText();
  }, [selectedImage]);

  return (
    <div>
      {loading && 
      <div className="flex flex-row space-x-1 items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
        </div>
      </div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TextRecognition;
