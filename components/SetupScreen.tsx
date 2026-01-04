import React, { useState } from 'react';
import { Icons } from './Icons';

interface SetupScreenProps {
  onApiKeySubmit: (key: string) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onApiKeySubmit }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) onApiKeySubmit(key.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-600 rounded-full">
             <Icons.Microscope className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2 academic-text">NSFC Pilot</h1>
        <h2 className="text-md text-center text-slate-500 mb-8">自然基金领航员 · Senior Reviewer Persona</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your Google GenAI API Key"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
            <p className="text-xs text-slate-400 mt-2">
              The key is used locally to initialize the reviewer persona.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            Start Session <Icons.Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};