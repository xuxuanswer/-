import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { PaperData } from '../types';

interface IngestScreenProps {
  onStartAnalysis: (papers: PaperData[]) => void;
  isProcessing: boolean;
}

export const IngestScreen: React.FC<IngestScreenProps> = ({ onStartAnalysis, isProcessing }) => {
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [activeTab, setActiveTab] = useState<'paste' | 'list'>('paste');
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedContent, setPastedContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPaper = () => {
    if (!pastedTitle.trim() || !pastedContent.trim()) return;
    
    const newPaper: PaperData = {
      id: Date.now().toString(),
      title: pastedTitle,
      content: pastedContent
    };
    
    setPapers(prev => [...prev, newPaper]);
    setPastedTitle('');
    setPastedContent('');
    setActiveTab('list');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();
      setPapers(prev => [...prev, {
        id: Date.now().toString() + i,
        title: file.name,
        content: text
      }]);
    }
    setActiveTab('list');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePaper = (id: string) => {
    setPapers(prev => prev.filter(p => p.id !== id));
  };

  const handleAnalyze = () => {
    if (papers.length > 0) {
      onStartAnalysis(papers);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
            <Icons.BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 academic-text">Literature Ingest</h1>
            <p className="text-sm text-slate-500">Step 1: Upload or paste reference papers for the Reviewer's Scan</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-6">
        
        {/* Left: Input Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-3 text-sm font-medium ${activeTab === 'paste' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Add Manually
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-3 text-sm font-medium ${activeTab === 'list' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Review List ({papers.length})
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'paste' ? (
              <div className="space-y-4 h-full flex flex-col">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Paper Title</label>
                  <input 
                    type="text" 
                    value={pastedTitle}
                    onChange={(e) => setPastedTitle(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="e.g., Single-Atom Catalysts for CO2 Reduction..."
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Content (Paste text)</label>
                  <textarea 
                    value={pastedContent}
                    onChange={(e) => setPastedContent(e.target.value)}
                    className="flex-1 w-full p-3 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-sm resize-none"
                    placeholder="Paste the full text of the abstract, introduction, and conclusion here..."
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                   <div>
                     <input 
                       type="file" 
                       accept=".txt,.md,.json" 
                       multiple
                       ref={fileInputRef}
                       className="hidden" 
                       onChange={handleFileUpload}
                     />
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                     >
                       <Icons.Upload size={14} /> Upload .txt files
                     </button>
                   </div>
                   <button 
                     onClick={handleAddPaper}
                     disabled={!pastedTitle || !pastedContent}
                     className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                   >
                     Add to Analysis
                   </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {papers.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Icons.File className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No papers added yet.</p>
                  </div>
                ) : (
                  papers.map(paper => (
                    <div key={paper.id} className="p-4 border border-slate-100 rounded-lg hover:border-indigo-100 hover:bg-indigo-50/30 transition group relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800 line-clamp-1">{paper.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {paper.content.substring(0, 150)}...
                          </p>
                        </div>
                        <button 
                          onClick={() => removePaper(paper.id)}
                          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Icons.Delete size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Action Area */}
        <div className="w-full md:w-80 flex flex-col justify-center">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-4 text-indigo-900">
               <Icons.Brain size={24} />
               <h2 className="font-bold">Start Brainstorming</h2>
             </div>
             <p className="text-sm text-slate-600 mb-6">
               The NSFC Pilot will analyze {papers.length} paper(s) to identify strategic gaps and innovation points.
             </p>
             <button
               onClick={handleAnalyze}
               disabled={papers.length === 0 || isProcessing}
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
             >
               {isProcessing ? (
                 <span className="animate-pulse">Analyzing...</span>
               ) : (
                 <>
                   Execute Reviewer Scan <Icons.Sparkles size={18} />
                 </>
               )}
             </button>
             {isProcessing && (
               <p className="text-xs text-center text-slate-500 mt-3 animate-pulse">
                 Reading documents & synthesizing mental map...
               </p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};