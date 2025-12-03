import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, FileUp, RotateCcw, Copy, Check } from 'lucide-react';
import { ParseInput } from '../services/geminiService';

interface ResumeUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (input: ParseInput) => Promise<void>;
  onReset: () => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ isOpen, onClose, onUpload, onReset }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedJson, setParsedJson] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await processUpload({ text });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = (reader.result as string).split(',')[1];
      await processUpload({
        file: {
          data: base64String,
          mimeType: file.type
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const processUpload = async (input: ParseInput) => {
    setIsProcessing(true);
    setParsedJson(null);
    try {
      // Logic for developers: We intercept the upload to show them the JSON
      // But we still trigger the onUpload prop so the UI updates
      const originalOnUpload = onUpload; // Keep reference
      
      // We need to wait for the app to update state, but we also want to get the data
      // Since onUpload in App.tsx calls parseResume again (inefficient but safe)
      // or we can't easily intercept the return value of onUpload if it's void.
      // Let's rely on localStorage updates? No, cleaner to just rely on App to handle it.
      // However, to show the JSON here, we might need to parse it ourselves or 
      // check localStorage after a brief delay.
      
      await onUpload(input);
      
      // Fetch result from localStorage to display code snippet
      setTimeout(() => {
        const saved = localStorage.getItem('user_cv_data');
        if (saved) setParsedJson(saved);
      }, 500);

      setText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // We do NOT close automatically if successful, so the user can copy the JSON
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to process resume. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (parsedJson) {
      navigator.clipboard.writeText(parsedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to the default example profile? This will clear your uploaded data.')) {
      onReset();
      setParsedJson(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Update CV Data</h2>
              <p className="text-sm text-slate-500">Developer Mode: Update content & Get JSON</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
           {parsedJson ? (
             <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-green-600 font-semibold flex items-center gap-2">
                   <Check size={18} /> Resume Processed Successfully
                 </h3>
                 <button 
                   onClick={handleCopy}
                   className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                 >
                   {copied ? <Check size={14} /> : <Copy size={14} />}
                   {copied ? 'Copied!' : 'Copy JSON'}
                 </button>
               </div>
               <p className="text-sm text-slate-600 mb-4">
                 To make this change permanent for all users, copy the JSON below and replace the content of 
                 <code className="mx-1 bg-slate-200 px-1 py-0.5 rounded text-slate-800">RESUME_DATA</code> 
                 in <code className="mx-1 bg-slate-200 px-1 py-0.5 rounded text-slate-800">constants.ts</code>.
               </p>
               <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono h-48 custom-scrollbar">
                 {JSON.stringify(JSON.parse(parsedJson), null, 2)}
               </pre>
               <div className="mt-6 flex justify-end">
                 <button onClick={onClose} className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                   Done
                 </button>
               </div>
             </div>
           ) : (
             <>
               {/* File Upload Section */}
               <div 
                 className={`border-2 border-dashed border-slate-200 rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-center transition-colors ${isProcessing ? 'opacity-50' : 'hover:border-blue-400 hover:bg-slate-50 cursor-pointer'}`}
                 onClick={() => !isProcessing && fileInputRef.current?.click()}
               >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="application/pdf"
                   onChange={handleFileChange}
                   disabled={isProcessing}
                 />
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                   <FileUp size={24} />
                 </div>
                 <h3 className="text-slate-900 font-semibold mb-1">Click to upload PDF</h3>
                 <p className="text-slate-500 text-sm">Supported format: .pdf</p>
               </div>

               <div className="relative flex items-center py-2 mb-6">
                 <div className="flex-grow border-t border-slate-200"></div>
                 <span className="flex-shrink-0 mx-4 text-slate-400 text-sm uppercase font-medium">Or paste text</span>
                 <div className="flex-grow border-t border-slate-200"></div>
               </div>

               {/* Text Area Section */}
               <form onSubmit={handleTextSubmit} className="flex flex-col h-full">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your full resume content here..."
                  className="w-full min-h-[150px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed resize-none font-mono mb-4"
                  disabled={isProcessing}
                />

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors text-sm flex items-center gap-2"
                    disabled={isProcessing}
                    title="Reset to default example"
                  >
                    <RotateCcw size={16} />
                    <span className="hidden sm:inline">Reset Default</span>
                    <span className="sm:hidden">Reset</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!text.trim() || isProcessing}
                      className={`px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-sm flex items-center gap-2 transition-all
                        ${!text.trim() || isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-md'}
                      `}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FileText size={18} />
                          Analyze Text
                        </>
                      )}
                    </button>
                  </div>
                </div>
               </form>
             </>
           )}
        </div>
      </div>
    </div>
  );
};