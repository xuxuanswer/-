import React, { useState, useEffect, useRef } from 'react';
import { Message, MessageRole } from '../types';
import { Icons } from './Icons';
import { MarkdownRenderer } from './MarkdownRenderer';
import { sendChatMessage } from '../services/geminiService';

interface ChatScreenProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onReset: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ messages, setMessages, onReset }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await sendChatMessage(input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText,
        timestamp: Date.now() + 1
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
         id: (Date.now() + 1).toString(),
         role: MessageRole.MODEL,
         text: "Error communicating with the reviewer persona. Please try again.",
         timestamp: Date.now() + 1
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
       {/* Header */}
       <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center text-white">
            <Icons.Microscope size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 academic-text">NSFC Review Board</h1>
            <p className="text-xs text-slate-500">Gap Analysis & Innovation Extraction</p>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50"
        >
          <Icons.Settings size={12} /> New Session
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-4xl w-full flex gap-4 ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                msg.role === MessageRole.USER ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white'
              }`}>
                {msg.role === MessageRole.USER ? <Icons.Check size={16} /> : <Icons.Brain size={16} />}
              </div>

              {/* Bubble */}
              <div className={`p-4 md:p-6 rounded-2xl shadow-sm border ${
                msg.role === MessageRole.USER 
                  ? 'bg-white text-slate-800 border-slate-200 rounded-tr-none' 
                  : 'bg-white text-slate-800 border-indigo-100 rounded-tl-none ring-1 ring-indigo-50'
              }`}>
                {msg.role === MessageRole.MODEL ? (
                  <MarkdownRenderer content={msg.text} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="max-w-4xl w-full flex gap-4">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mt-1">
                 <Icons.Brain size={16} />
               </div>
               <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-indigo-100 ring-1 ring-indigo-50">
                 <div className="flex space-x-2 items-center h-6">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 md:p-6">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reply to the reviewer (e.g., 'Proposed innovation: Use MOF-derived carbon...')"
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none shadow-sm max-h-40"
            rows={1}
            style={{ minHeight: '3rem' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2.5 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Icons.Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
          AI Reviewer can be harsh. This is by design to improve your proposal quality.
        </p>
      </div>
    </div>
  );
};