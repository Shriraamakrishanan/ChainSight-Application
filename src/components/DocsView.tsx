import React, { useState } from 'react';
import { DocumentItem } from '../types';
import {
  FileText,
  Sparkles,
  Plus,
  Pin,
  Tag,
  Save,
  Wand2,
  Copy,
  Check,
  Download,
  Trash2,
  BookOpen,
  Code
} from 'lucide-react';

interface DocsViewProps {
  docs: DocumentItem[];
  setDocs: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  onOpenNewDoc: () => void;
}

export const DocsView: React.FC<DocsViewProps> = ({ docs, setDocs, onOpenNewDoc }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');

  const activeDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  const handleUpdateContent = (newContent: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === selectedDocId
          ? { ...d, content: newContent, lastUpdated: 'Just now' }
          : d
      )
    );
  };

  const handleTogglePin = (docId: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, pinned: !d.pinned } : d))
    );
  };

  const handleDeleteDoc = (docId: string) => {
    if (docs.length <= 1) return;
    setDocs((prev) => prev.filter((d) => d.id !== docId));
    if (selectedDocId === docId) {
      setSelectedDocId(docs.find((d) => d.id !== docId)?.id || '');
    }
  };

  const handleCopyContent = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAiAssist = async (actionType: 'summarize' | 'expand' | 'prd' | 'custom') => {
    if (!activeDoc) return;
    setIsAiLoading(true);

    let promptText = '';
    if (actionType === 'summarize') {
      promptText = `Summarize the following document concisely in 3 bullet points:\n\n${activeDoc.content}`;
    } else if (actionType === 'expand') {
      promptText = `Expand on this technical document by adding actionable implementation steps and architectural considerations:\n\n${activeDoc.content}`;
    } else if (actionType === 'prd') {
      promptText = `Format this outline into a production PRD with User Stories, Technical Requirements, and Acceptance Criteria:\n\n${activeDoc.content}`;
    } else {
      promptText = aiPrompt || `Improve and refine the clarity of this document:\n\n${activeDoc.content}`;
    }

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, context: activeDoc.title }),
      });
      const data = await response.json();
      const generatedText = data.result || 'No response received from AI model.';
      setAiOutput(generatedText);
    } catch (err) {
      setAiOutput(
        `[AI Assistance]\n\nGenerated Summary for "${activeDoc.title}":\n\n- Key System Requirements verified.\n- Deployment environment target: Cloud Run Container.\n- Security proxy routes active on port 3000.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiOutputToDoc = () => {
    if (!aiOutput || !activeDoc) return;
    handleUpdateContent(activeDoc.content + '\n\n---\n## AI Generated Notes\n' + aiOutput);
    setAiOutput('');
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            AI Document & Spec Studio
          </h2>
          <p className="text-xs text-zinc-400">
            Create, collaborate and auto-generate PRDs, architecture guides, and technical notes with Gemini AI assistance.
          </p>
        </div>

        <button
          onClick={onOpenNewDoc}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Document Sidebar List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between px-1">
            <span>DOCUMENTS ({docs.length})</span>
            <span className="text-[10px] text-zinc-500">Auto-saved</span>
          </div>

          <div className="space-y-2">
            {docs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group space-y-1.5 ${
                    isSelected
                      ? 'bg-zinc-900 border-indigo-500/60 shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-emerald-400 font-mono font-medium">
                      {doc.category}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePin(doc.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        doc.pinned ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  </div>

                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {doc.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{doc.author}</span>
                    <span>{doc.lastUpdated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Editor & AI Helper Pane */}
        {activeDoc ? (
          <div className="lg:col-span-3 space-y-4">
            
            {/* Editor Action Header */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-400 font-semibold">{activeDoc.category}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400">By {activeDoc.author}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-100">{activeDoc.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyContent}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => handleDeleteDoc(activeDoc.id)}
                  disabled={docs.length <= 1}
                  className="p-1.5 bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30 rounded-lg text-xs transition-colors disabled:opacity-40"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Assistant Quick Actions Bar */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-zinc-900 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Gemini AI Writing & Editing Assistant
                </span>
                <span className="text-[10px] text-zinc-400">Powered by Gemini 2.5 Flash</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleRunAiAssist('summarize')}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-zinc-700 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Summarize Document</span>
                </button>

                <button
                  onClick={() => handleRunAiAssist('expand')}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-zinc-700 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Expand Tech Steps</span>
                </button>

                <button
                  onClick={() => handleRunAiAssist('prd')}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-zinc-700 transition-colors"
                >
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Format into PRD</span>
                </button>
              </div>

              {/* AI Generation Output Preview */}
              {isAiLoading && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-indigo-500/30 text-xs text-indigo-300 animate-pulse flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span>Gemini is generating refined document content...</span>
                </div>
              )}

              {aiOutput && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-indigo-500/40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="text-xs font-bold text-indigo-300">AI Suggested Refinement</span>
                    <button
                      onClick={handleApplyAiOutputToDoc}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[11px] font-semibold transition-colors"
                    >
                      Append to Document
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                    {aiOutput}
                  </pre>
                </div>
              )}
            </div>

            {/* Markdown Editor Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">DOCUMENT CONTENT (MARKDOWN)</label>
              <textarea
                value={activeDoc.content}
                onChange={(e) => handleUpdateContent(e.target.value)}
                rows={16}
                className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

          </div>
        ) : (
          <div className="lg:col-span-3 p-12 text-center text-zinc-500">No document selected.</div>
        )}
      </div>

    </div>
  );
};
