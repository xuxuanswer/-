import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { IngestScreen } from './components/IngestScreen';
import { ChatScreen } from './components/ChatScreen';
import { AppState, Message, PaperData, MessageRole } from './types';
import { initializeGemini, startChatSession } from './services/geminiService';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApiKeySubmit = (key: string) => {
    try {
      initializeGemini(key);
      setAppState(AppState.INGEST);
    } catch (e) {
      alert("Failed to initialize API. Check console.");
    }
  };

  const handleStartAnalysis = async (papers: PaperData[]) => {
    setIsProcessing(true);
    
    // Combine paper contents into a single context string
    const context = papers.map(p => `Title: ${p.title}\nContent:\n${p.content}\n---`).join('\n');

    try {
      const initialResponse = await startChatSession(context);
      
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: MessageRole.MODEL,
        text: initialResponse,
        timestamp: Date.now()
      };
      
      setMessages([initialMessage]);
      setAppState(AppState.ANALYSIS);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Analysis failed. Please try fewer papers or check your API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setAppState(AppState.INGEST);
  };

  return (
    <div className="h-screen w-screen bg-slate-50">
      {appState === AppState.SETUP && (
        <SetupScreen onApiKeySubmit={handleApiKeySubmit} />
      )}
      
      {appState === AppState.INGEST && (
        <IngestScreen 
          onStartAnalysis={handleStartAnalysis} 
          isProcessing={isProcessing}
        />
      )}
      
      {appState === AppState.ANALYSIS && (
        <ChatScreen 
          messages={messages} 
          setMessages={setMessages} 
          onReset={handleReset}
        />
      )}
    </div>
  );
}