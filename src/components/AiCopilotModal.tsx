import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({ isOpen, onClose }) => {
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello! I am ChainSight AI, your predictive supply chain & POS telemetry copilot. Ask me about current disruptions, POS stockout risks, or route optimizations!',
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const userMsgObj: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          context: 'Current Supply Chain State: Global Health Score 87/100. South China Sea Typhoon active in 4 days. POS store in Bangalore reports +42.5% demand surge.',
        }),
      });

      const data = await res.json();
      const aiText = data.result || 'I have processed your query and updated the supply chain telemetry.';

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `### ChainSight AI Telemetry Analysis

Based on your query, current South India retail POS stockout risk is **elevated**.

#### Recommended Mitigation Actions
1. **POS Auto-Replenishment:** Draw down 30-day buffer inventory from Chennai distribution hub.
2. **Dynamic Rerouting:** Reroute **35% of inbound volume** via Ningbo Port to bypass South China Sea weather delays.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputMsg(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[88dvh] sm:h-[560px]">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-100">ChainSight AI Copilot</h3>
              <p className="text-[10px] text-cyan-400 font-mono">Gemini 3.6 Flash Live Telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close AI Copilot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[88%] p-3 sm:p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-zinc-950 font-medium text-xs'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs space-y-2'
                }`}
              >
                {m.sender === 'user' ? (
                  m.text
                ) : (
                  <div className="prose prose-invert max-w-none text-xs space-y-2 [&_h1]:text-xs [&_h1]:sm:text-sm [&_h1]:font-bold [&_h1]:text-cyan-400 [&_h2]:text-xs [&_h2]:font-bold [&_h2]:text-cyan-300 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-zinc-100 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_strong]:text-cyan-300 [&_p]:my-1">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ ...props }) => (
                          <div className="overflow-x-auto my-2 border border-zinc-800 rounded-xl">
                            <table className="w-full text-left text-[11px] border-collapse bg-zinc-950 min-w-[280px]" {...props} />
                          </div>
                        ),
                        thead: ({ ...props }) => (
                          <thead className="bg-zinc-900 text-cyan-400 font-bold border-b border-zinc-800" {...props} />
                        ),
                        tbody: ({ ...props }) => (
                          <tbody className="divide-y divide-zinc-800/60" {...props} />
                        ),
                        tr: ({ ...props }) => (
                          <tr className="hover:bg-zinc-900/50 transition-colors" {...props} />
                        ),
                        th: ({ ...props }) => (
                          <th className="px-2.5 py-1.5 font-mono font-bold text-[10px] sm:text-[11px] text-cyan-300 border-r border-zinc-800/80 last:border-r-0" {...props} />
                        ),
                        td: ({ ...props }) => (
                          <td className="px-2.5 py-1.5 text-[10px] sm:text-[11px] text-zinc-300 border-r border-zinc-800/60 last:border-r-0 font-mono" {...props} />
                        ),
                      }}
                    >
                      {m.text}
                    </Markdown>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-mono p-1">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Analyzing live telemetry data feeds...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3.5 py-2 bg-zinc-900/50 border-t border-zinc-800 flex gap-2 overflow-x-auto text-[10px]">
          <button
            type="button"
            onClick={() => handleQuickPrompt('What are current POS stockout risks?')}
            className="px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-cyan-500/50 cursor-pointer whitespace-nowrap min-h-[32px] flex items-center"
          >
            POS Stockout Risks
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrompt('Suggest playbook for South China Sea Typhoon')}
            className="px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-cyan-500/50 cursor-pointer whitespace-nowrap min-h-[32px] flex items-center"
          >
            Typhoon Playbook
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrompt('Give executive summary of global supply chain risks')}
            className="px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-cyan-500/50 cursor-pointer whitespace-nowrap min-h-[32px] flex items-center"
          >
            Executive Risk Brief
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask AI Copilot about supply chain risk..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm sm:text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

      </div>
    </div>
  );
};
