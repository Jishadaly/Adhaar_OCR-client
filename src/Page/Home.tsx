import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAadhaarDetails, setUploadedImage } from '../utils/context/Reducers/authSlice';
import Tesseract from 'tesseract.js';

interface AadhaarData {
  name: string;
  aadhaarNumber: string;
  dob: string;
  gender: string;
  address: string;
}

const Home: React.FC = () => {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [aadhaarData, setAadhaarData] = useState<AadhaarData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = reader.result as string;
        if (side === 'front') {
          setFrontImage(image);
        } else {
          setBackImage(image);
        }
        dispatch(setUploadedImage(image));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOcrProcess = () => {
    setLoading(true);
    setError(null);

    const ocrPromises = [frontImage, backImage].map((image, index) =>
      Tesseract.recognize(
        image as string,
        'eng',
        {
          logger: (m:any) => console.log(m),
        }
      ).then((result: Tesseract.RecognizeResult) => ({
        side: index === 0 ? 'front' : 'back',
        text: result.data.text,
      }))
    );

    Promise.all(ocrPromises)
      .then((results) => {
        const frontText = results.find((r: { side: string; text: string }) => r.side === 'front')?.text || '';
        const backText = results.find((r: { side: string; text: string }) => r.side === 'back')?.text || '';
        const combinedText = frontText + ' ' + backText;

        const aadhaarNumberPattern = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
        const namePattern = /^([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/m;
        const dobPattern = /DOB:\s*(\d{2}\/\d{2}\/\d{4})/i;
        const genderPattern = /\b(Male|Female)\b/i;
        const addressPattern = /Address:?\s*(S\/O.*?)(?:\d{6}|$)/is;

        const extractedData: AadhaarData = {
          name: 'Not found',
          aadhaarNumber: combinedText.match(aadhaarNumberPattern)?.[0]?.replace(/\s/g, ' ') || 'Not found',
          dob: 'Not found',
          gender: 'Not found',
          address: 'Not found',
        };

        // Extract Name
        const nameMatch = frontText.match(namePattern);
        if (nameMatch) {
          extractedData.name = nameMatch[1].trim();
        }

        // Extract DOB
        const dobMatch = frontText.match(dobPattern);
        if (dobMatch) {
          extractedData.dob = dobMatch[1];
        }

        // Extract Gender
        const genderMatch = frontText.match(genderPattern);
        if (genderMatch) {
          extractedData.gender = genderMatch[0];
        }

        // Extract Address
        const addressMatch = backText.match(addressPattern);
        if (addressMatch) {
          extractedData.address = addressMatch[1]
            .replace(/\n/g, ', ')
            .replace(/,\s*,/g, ',')
            .replace(/\s+/g, ' ')
            .trim();
        }

        setAadhaarData(extractedData);
        dispatch(setAadhaarDetails(extractedData));
      })
      .catch((error) => {
        console.error('OCR Error:', error);
        setError('Failed to process the Aadhaar card. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">Aadhaar Card OCR</h1>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 mb-8">
        <div className="flex flex-col items-center">
          <label className="w-64 min-h-min flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition duration-300">
            <span className="text-gray-500 mb-2">Upload Front Image</span>
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V8m0 0l4 4m0 0l4-4m-4 4v8m0-8H3m14 0h4"
              ></path>
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'front')}
              className="hidden"
            />
          </label>
          {frontImage && (
            <img
              src={frontImage}
              alt="Front Aadhaar"
              className="mt-4 w-64 h-auto rounded-lg shadow-md"
            />
          )}
        </div>

        <div className="flex flex-col items-center">
          <label className="w-64 min-h-min flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition duration-300">
            <span className="text-gray-500 mb-2">Upload Back Image</span>
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V8m0 0l4 4m0 0l4-4m-4 4v8m0-8H3m14 0h4"
              ></path>
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'back')}
              className="hidden"
            />
          </label>
          {backImage && (
            <img
              src={backImage}
              alt="Back Aadhaar"
              className="mt-4 w-64 h-auto rounded-lg shadow-md"
            />
          )}
        </div>
      </div>

      <button
        className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-400 transition duration-300"
        onClick={handleOcrProcess}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Process Aadhaar'}
      </button>

      {error && (
        <div className="mt-8 bg-red-100 p-4 rounded-lg shadow-md w-full max-w-lg">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {aadhaarData && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Extracted Aadhaar Information:</h2>
          {Object.entries(aadhaarData).map(([key, value]) => (
            <p key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value as string}
            </p>
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;
// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setAadhaarDetails, setUploadedImage } from '../utils/context/Reducers/authSlice';
// import Tesseract from 'tesseract.js';

// const Home: React.FC = () => {
//   const [frontImage, setFrontImage] = useState<string | null>(null);
//   const [backImage, setBackImage] = useState<string | null>(null);
//   const [aadhaarData, setAadhaarData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const dispatch = useDispatch();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (side === 'front') {
//           setFrontImage(reader.result as string);
//           dispatch(setUploadedImage(reader.result as string));
//         } else {
//           setBackImage(reader.result as string);
//           dispatch(setUploadedImage(reader.result as string));
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleOcrProcess = () => {
//     setLoading(true);
//     setError(null);

//     const ocrPromises = [frontImage, backImage].map((image, index) =>
//       Tesseract.recognize(
//         image as string,
//         'eng',
//         {
//           logger: (m) => console.log(m),
//         }
//       ).then((result) => ({
//         side: index === 0 ? 'front' : 'back',
//         text: result.data.text,
//       }))
//     );

//     Promise.all(ocrPromises)
//       .then((results) => {
//         const frontText = results.find(r => r.side === 'front')?.text || '';
//         const backText = results.find(r => r.side === 'back')?.text || '';
//         const combinedText = frontText + ' ' + backText;

//         console.log('Front Text:', frontText);
//         console.log('Back Text:', backText);
//         console.log('Combined Text:', combinedText);

//         const aadhaarNumberPattern = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
//         const dobPattern = /DOB[:\s]*(\d{2}\/\d{2}\/\d{4})/i;
//         const genderPattern = /\b(Male|Female)\b/i;
//         const addressPattern = /Address:?\s*(.*)/is;

//         const extractedData = {
//           name: 'Not found',
//           aadhaarNumber: combinedText.match(aadhaarNumberPattern)?.[0]?.replace(/\s/g, ' ') || 'Not found',
//           dob: 'Not found',
//           gender: 'Not found',
//           address: 'Not found',
//         };

//         // Refined Name Extraction Logic
//         const namePattern = /Government of india \s+([\w\s]+)\s/i;
//         const nameMatch = combinedText.match(namePattern);
//         console.log(nameMatch,"?????")
//         if (nameMatch) {
//             let name = nameMatch[1].trim();
//             // Remove any trailing non-alphabetic characters if present
//             name = name.replace(/[^a-zA-Z\s]+$/, '').trim();
//             extractedData.name = name;
//         }

//         // Extract DOB
//         const dobMatch = frontText.match(dobPattern);
//         if (dobMatch) {
//             extractedData.dob = dobMatch[1];
//         }

//         // Extract Gender
//         const genderMatch = frontText.match(genderPattern);
//         if (genderMatch) {
//             extractedData.gender = genderMatch[0];
//         }

//         // Extract Address
//         const addressMatch = backText.match(addressPattern);
//         if (addressMatch) {
//             const addressLines = addressMatch[1].split('\n').filter(line => line.trim());
//             const filteredAddress = addressLines
//                 .filter(line => !line.match(/^[A-Z0-9]{8,}$/)) // Filter out lines that look like a QR code
//                 .join(', ')
//                 .replace(/,\s*,/g, ',')
//                 .replace(/\s+/g, ' ')
//                 .trim();

//             extractedData.address = filteredAddress || 'Not found';
//         }

//         console.log('Extracted Data:', extractedData);

//         setAadhaarData(extractedData);
//         dispatch(setAadhaarDetails(extractedData));
//       })
//       .catch((error) => {
//         console.error('OCR Error:', error);
//         setError('Failed to process the Aadhaar card. Please try again.');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
//       <h1 className="text-4xl font-bold text-blue-800 mb-8">Aadhaar Card OCR</h1>

//       <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 mb-8">
//         <div className="flex flex-col items-center">
//           <label className="w-64 min-h-min flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition duration-300">
//             <span className="text-gray-500 mb-2">Upload Front Image</span>
//             <svg
//               className="w-12 h-12 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M7 16V8m0 0l4 4m0 0l4-4m-4 4v8m0-8H3m14 0h4"
//               ></path>
//             </svg>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, 'front')}
//               className="hidden"
//             />
//           </label>
//           {frontImage && (
//             <img
//               src={frontImage}
//               alt="Front Aadhaar"
//               className="mt-4 w-64 h-auto rounded-lg shadow-md"
//             />
//           )}
//         </div>

//         <div className="flex flex-col items-center">
//           <label className="w-64 min-h-min flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition duration-300">
//             <span className="text-gray-500 mb-2">Upload Back Image</span>
//             <svg
//               className="w-12 h-12 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M7 16V8m0 0l4 4m0 0l4-4m-4 4v8m0-8H3m14 0h4"
//               ></path>
//             </svg>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, 'back')}
//               className="hidden"
//             />
//           </label>
//           {backImage && (
//             <img
//               src={backImage}
//               alt="Back Aadhaar"
//               className="mt-4 w-64 h-auto rounded-lg shadow-md"
//             />
//           )}
//         </div>
//       </div>

//       <button
//         className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-400 transition duration-300"
//         onClick={handleOcrProcess}
//         disabled={loading}
//       >
//         {loading ? 'Processing...' : 'Process Aadhaar'}
//       </button>

//       {error && (
//         <div className="mt-8 bg-red-100 p-4 rounded-lg shadow-md w-full max-w-lg">
//           <p className="text-red-500">{error}</p>
//         </div>
//       )}

//       {aadhaarData && (
//         <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
//           <h2 className="text-2xl font-bold mb-4">Extracted Aadhaar Information:</h2>
//           {Object.entries(aadhaarData).map(([key, value]) => (
//             <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
