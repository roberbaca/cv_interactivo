import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { ResumeView } from './components/ResumeView';
import { ResumeUploader } from './components/ResumeUploader';
import { RESUME_DATA, SUGGESTED_QUESTIONS } from './constants';
import { initializeChat, sendMessageToGemini, parseResume, ParseInput, generateGreeting } from './services/geminiService';
import { Message, ViewMode, CVData } from './types';
import { MessageSquare, FileText, Download, Upload } from 'lucide-react';

const App: React.FC = () => {
  // Check if we are in "Edit Mode" via URL Parameter (?mode=edit)
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEditMode(params.get('mode') === 'edit');
  }, []);

  // Application State
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      // We prioritize localStorage if it exists (useful for dev), 
      // otherwise fallback to constants.ts (what the public sees)
      const savedData = localStorage.getItem('user_cv_data');
      return savedData ? JSON.parse(savedData) : RESUME_DATA;
    } catch (e) {
      console.error("Error parsing saved CV data", e);
      return RESUME_DATA;
    }
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  
  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode(ViewMode.CHAT); // Default to chat on mobile
      } else {
        setViewMode(ViewMode.SPLIT);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Chat Session (Re-runs when cvData changes)
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await initializeChat(cvData);
        
        // Generate a dynamic greeting based on CV language
        const greetingText = await generateGreeting(cvData);
        
        const initialGreeting: Message = {
          id: `init-${Date.now()}`,
          role: 'model',
          text: greetingText,
          timestamp: new Date()
        };
        setMessages([initialGreeting]);
      } catch (error) {
        console.error("Failed to initialize chat", error);
        setMessages([{
            id: 'error',
            role: 'model',
            text: "System Error: Unable to initialize chat agent.",
            timestamp: new Date()
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [cvData]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (input: ParseInput) => {
    const newData = await parseResume(input);
    setCvData(newData);
    // Persist to local storage
    localStorage.setItem('user_cv_data', JSON.stringify(newData));
  };

  const handleResetToDefault = () => {
    setCvData(RESUME_DATA);
    localStorage.removeItem('user_cv_data');
  };

  const toggleMobileView = () => {
    setViewMode(prev => prev === ViewMode.CHAT ? ViewMode.RESUME : ViewMode.CHAT);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      <ResumeUploader 
        isOpen={isUploaderOpen} 
        onClose={() => setIsUploaderOpen(false)} 
        onUpload={handleResumeUpload}
        onReset={handleResetToDefault}
      />

      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            {cvData.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight truncate max-w-[150px] sm:max-w-xs">{cvData.name}</h1>
            <p className="text-xs text-slate-500 font-medium">Interactive Resume AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            {/* Upload Button - ONLY VISIBLE IN EDIT MODE */}
            {isEditMode && (
              <button
                  onClick={() => setIsUploaderOpen(true)}
                  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-blue-200"
                  title="Dev Mode: Upload & Copy CV JSON"
              >
                  <Upload size={18} />
                  <span className="hidden sm:inline">Update CV Data</span>
              </button>
            )}

            {/* Desktop Print Button */}
            <button 
                onClick={() => window.print()}
                className="hidden sm:flex p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors items-center gap-2 text-sm font-medium"
            >
                <Download size={18} />
                <span>Print</span>
            </button>
        </div>

        {/* Mobile View Toggle */}
        <div className="md:hidden flex items-center gap-2 ml-2">
            <button 
                onClick={toggleMobileView}
                className="p-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-200"
            >
                {viewMode === ViewMode.CHAT ? (
                    <FileText size={18} />
                ) : (
                    <MessageSquare size={18} />
                )}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Resume Panel */}
        <div className={`
            transition-all duration-300 ease-in-out h-full
            ${viewMode === ViewMode.SPLIT ? 'w-1/2 border-r border-slate-200' : ''}
            ${viewMode === ViewMode.RESUME ? 'w-full' : ''}
            ${viewMode === ViewMode.CHAT ? 'hidden' : ''}
        `}>
          <ResumeView data={cvData} />
        </div>

        {/* Chat Panel */}
        <div className={`
            transition-all duration-300 ease-in-out h-full bg-slate-50
            ${viewMode === ViewMode.SPLIT ? 'w-1/2' : ''}
            ${viewMode === ViewMode.CHAT ? 'w-full' : ''}
            ${viewMode === ViewMode.RESUME ? 'hidden' : ''}
        `}>
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            suggestedQuestions={SUGGESTED_QUESTIONS}
            cvName={cvData.name}
          />
        </div>

      </main>
    </div>
  );
};

export default App;