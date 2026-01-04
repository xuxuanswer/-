import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate prose-sm max-w-none dark:prose-invert academic-text">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-slate-800 border-b pb-2 mt-4 mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold text-slate-800 mt-4 mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-md font-semibold text-slate-700 mt-3 mb-1" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-indigo-900 bg-indigo-50 px-1 rounded" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-2 bg-slate-50 italic text-slate-600" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-slate-200 border" {...props} /></div>,
          th: ({node, ...props}) => <th className="px-3 py-2 bg-slate-100 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b" {...props} />,
          td: ({node, ...props}) => <td className="px-3 py-2 whitespace-normal text-sm text-slate-600 border-b border-r last:border-r-0" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};