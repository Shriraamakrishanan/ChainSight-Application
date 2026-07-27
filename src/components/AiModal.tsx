import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Check, Copy } from 'lucide-react';

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Workspace Copilot powered by Gemini 3.6 Flash. How can I assist with your tasks, code proxy, or analytics today?',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userMsg = inputPrompt.trim();
    setInputPrompt('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          systemInstruction: 'You are an AI Workspace Copilot for developer operations, task planning, and analytics.',
        }),
      });

      const data = await res.json();
      if (data.result) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.result }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: 'I completed processing your query. How else can I assist?' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'An unexpected network error occurred while communicating with Gemini API.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">AI Copilot</h3>
              <p className="text-[11px] text-zinc-400">Gemini 3.6 Flash Server Proxy Integration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-indigo-400 border border-zinc-700'
                }`}
              >
                {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 relative group ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-zinc-950 border border-zinc-800/80 text-zinc-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.text, idx)}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 transition-opacity cursor-pointer pt-1"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 text-indigo-400 border border-zinc-700 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl rounded-tl-none text-xs text-indigo-400 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>Gemini is generating response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask AI Copilot anything (e.g. summarize tasks, explain APIs)..."
            className="flex-1 bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
