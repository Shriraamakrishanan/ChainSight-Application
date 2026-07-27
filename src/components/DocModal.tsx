import React, { useState } from 'react';
import { DocumentItem } from '../types';
import { X, Sparkles, FileText } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: Partial<DocumentItem>) => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'PRD' | 'Meeting' | 'Architecture' | 'Guide' | 'General'>('PRD');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('Product, Specs');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      category,
      content: content || `# ${title}\n\n## Overview\nDraft initial details here...\n`,
      tags: tagsInput.split(',').map((t) => t.trim()),
      author: 'Alex Rivera',
      lastUpdated: 'Just now',
      pinned: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Draft New Document or Technical Spec
          </h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-400">DOCUMENT TITLE</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cloud Run Auto-scaling Architecture"
              className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-400">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="PRD">PRD (Product Requirements)</option>
              <option value="Architecture">Architecture Specification</option>
              <option value="Guide">Operations Guide / Playbook</option>
              <option value="Meeting">Meeting Notes</option>
              <option value="General">General Note</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-zinc-400">INITIAL OUTLINE (MARKDOWN)</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter initial document notes or leave empty for template..."
              className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
            >
              Create Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
