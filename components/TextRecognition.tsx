import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

interface TextRecognitionProps {
  selectedImage: string;
}

const TextRecognition: React.FC<TextRecognitionProps> = ({ selectedImage }) => {
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage) {
        setLoading(true);
        setError(null);

        try {
          const result = await Tesseract.recognize(selectedImage, 'ita', {
            logger: info => console.log(info), 
          });
          setRecognizedText(result.data.text);
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
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && <p>{recognizedText}</p>}
    </div>
  );
};

export default TextRecognition;
