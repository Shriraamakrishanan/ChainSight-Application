import React, { useState } from 'react';
import { NoteItem } from '../types';
import { Sparkles, Pin, Tag, Plus, Trash2, Edit3, Check, FileText, Share2, Copy } from 'lucide-react';

interface NotesStudioProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  searchQuery: string;
}

export const NotesStudio: React.FC<NotesStudioProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  searchQuery,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [aiWorking, setAiWorking] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || filteredNotes[0] || notes[0];

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `NOTE-${Date.now()}`,
      title: 'Untitled Strategy Document',
      category: 'Product',
      content: '# New Document Title\n\nStart typing note details or technical architecture notes here...',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      pinned: false,
      tags: ['Draft', 'New'],
    };
    onAddNote(newNote);
    setSelectedNoteId(newNote.id);
  };

  const handleAiAction = async (actionType: 'summarize' | 'polish' | 'action_items') => {
    if (!selectedNote) return;
    setAiWorking(true);
    setAiResult(null);

    let promptText = '';
    if (actionType === 'summarize') {
      promptText = `Provide a 3-bullet executive summary for this document:\n\n${selectedNote.content}`;
    } else if (actionType === 'polish') {
      promptText = `Polish and improve the clarity and grammar of this text while maintaining professional tone:\n\n${selectedNote.content}`;
    } else {
      promptText = `Extract actionable engineering or business TODO items from this note:\n\n${selectedNote.content}`;
    }

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemInstruction: 'You are an elite executive strategy and technical writing assistant.',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setAiResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiWorking(false);
    }
  };

  const handleCopyAiResult = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
      {/* Left Sidebar Notes List */}
      <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col space-y-4">
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">Document Workspace</h3>
            <p className="text-[11px] text-zinc-400">{filteredNotes.length} notes saved</p>
          </div>

          <button
            onClick={handleCreateNote}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          {['ALL', 'Product', 'Engineering', 'Design', 'Strategy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Note Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredNotes.map((note) => {
            const isSelected = selectedNote?.id === note.id;
            return (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500/50 text-zinc-100'
                    : 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {note.category}
                  </span>
                  {note.pinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />}
                </div>

                <h4 className="text-xs font-bold leading-snug truncate">{note.title}</h4>

                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{note.content.replace(/#+/g, '')}</p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500">
                  <span>{note.updatedAt}</span>
                  <div className="flex gap-1">
                    {note.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] px-1 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Main Editor & AI Panel */}
      <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 flex flex-col space-y-4">
        {selectedNote ? (
          <>
            {/* Note Editor Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => onUpdateNote({ ...selectedNote, title: e.target.value })}
                  className="w-full bg-transparent text-base font-bold text-zinc-100 focus:outline-none border-b border-transparent focus:border-indigo-500 transition-all"
                  placeholder="Note Title..."
                />
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                  <span>Updated {selectedNote.updatedAt}</span>
                  <span>•</span>
                  <span>{selectedNote.content.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateNote({ ...selectedNote, pinned: !selectedNote.pinned })}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    selectedNote.pinned ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                  title="Toggle Pin"
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteNote(selectedNote.id)}
                  className="p-2 bg-zinc-800 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 rounded-lg border border-zinc-700 transition-all cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI Magic Bar */}
            <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-bold text-indigo-400 pr-2 border-r border-zinc-800">
                <Sparkles className="w-3.5 h-3.5" /> AI Tools:
              </span>

              <button
                onClick={() => handleAiAction('summarize')}
                disabled={aiWorking}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg font-medium cursor-pointer transition-all disabled:opacity-50"
              >
                Summarize
              </button>

              <button
                onClick={() => handleAiAction('polish')}
                disabled={aiWorking}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg font-medium cursor-pointer transition-all disabled:opacity-50"
              >
                Polish & Clean
              </button>

              <button
                onClick={() => handleAiAction('action_items')}
                disabled={aiWorking}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg font-medium cursor-pointer transition-all disabled:opacity-50"
              >
                Action Items
              </button>

              {aiWorking && <span className="text-[11px] text-indigo-400 animate-pulse ml-auto">Gemini Processing...</span>}
            </div>

            {/* AI Output Result Box if available */}
            {aiResult && (
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5 space-y-2 relative">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-300 border-b border-indigo-500/20 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Generated Insights
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyAiResult}
                      className="flex items-center gap-1 text-[10px] text-indigo-300 hover:text-white cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button onClick={() => setAiResult(null)} className="text-[10px] text-zinc-400 hover:text-zinc-200 cursor-pointer">
                      Dismiss
                    </button>
                  </div>
                </div>
                <div className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">{aiResult}</div>
              </div>
            )}

            {/* Main Note Textarea */}
            <textarea
              value={selectedNote.content}
              onChange={(e) =>
                onUpdateNote({
                  ...selectedNote,
                  content: e.target.value,
                  updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                })
              }
              className="flex-1 w-full bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 text-xs font-mono text-zinc-200 leading-relaxed focus:outline-none focus:border-indigo-500/80 transition-all resize-none"
              placeholder="Write markdown note content..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
            <FileText className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-xs font-medium">No note selected. Select or create a document to begin editing.</p>
          </div>
        )}
      </div>
    </div>
  );
};
