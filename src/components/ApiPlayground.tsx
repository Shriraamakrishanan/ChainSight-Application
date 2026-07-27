import React, { useState } from 'react';
import { SavedApiEndpoint, ApiResponseLog } from '../types';
import { Play, Terminal, CheckCircle2, AlertTriangle, Clock, Code2, Plus, Trash2, Copy, Check } from 'lucide-react';

interface ApiPlaygroundProps {
  savedEndpoints: SavedApiEndpoint[];
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ savedEndpoints }) => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [url, setUrl] = useState<string>('/api/health');
  const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState<string>('{\n  "prompt": "Hello Gemini, explain container proxy routing."\n}');
  const [loading, setLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<ApiResponseLog | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSendRequest = async () => {
    setLoading(true);
    setResponseLog(null);
    const startTime = performance.now();

    try {
      let parsedHeaders: Record<string, string> = {};
      try {
        parsedHeaders = JSON.parse(headers);
      } catch (e) {
        // Fallback default header
        parsedHeaders = { 'Content-Type': 'application/json' };
      }

      const options: RequestInit = {
        method,
        headers: parsedHeaders,
      };

      if (['POST', 'PUT'].includes(method) && body.trim()) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      let responseData: any;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      const headerObj: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headerObj[key] = val;
      });

      setResponseLog({
        timestamp: new Date().toLocaleTimeString(),
        status: res.status,
        statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
        timeMs,
        headers: headerObj,
        data: responseData,
      });
    } catch (err: any) {
      const endTime = performance.now();
      setResponseLog({
        timestamp: new Date().toLocaleTimeString(),
        status: 500,
        statusText: 'Network / Client Exception',
        timeMs: Math.round(endTime - startTime),
        headers: {},
        data: { error: err.message || 'Request failed to execute' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadEndpoint = (ep: SavedApiEndpoint) => {
    setMethod(ep.method);
    setUrl(ep.url);
    setHeaders(JSON.stringify(ep.headers, null, 2));
    if (ep.body) setBody(ep.body);
  };

  const handleCopyResponse = () => {
    if (!responseLog) return;
    navigator.clipboard.writeText(JSON.stringify(responseLog.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'POST':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'PUT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
      {/* Left Sidebar Saved Collections */}
      <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col space-y-4">
        <div className="pb-3 border-b border-zinc-800">
          <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" /> Saved API Collections
          </h3>
          <p className="text-[11px] text-zinc-400">Select pre-configured backend endpoints to test.</p>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto">
          {savedEndpoints.map((ep) => (
            <div
              key={ep.id}
              onClick={() => handleLoadEndpoint(ep)}
              className="p-3 bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-lg transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getMethodBadge(ep.method)}`}>
                  {ep.method}
                </span>
                <span className="text-[10px] text-zinc-500">{ep.category}</span>
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">{ep.name}</h4>
              <p className="text-[10px] font-mono text-zinc-400 truncate">{ep.url}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Request & Response Workbench */}
      <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 flex flex-col space-y-4">
        {/* Request Address Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 text-xs font-bold text-indigo-400 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter request URL, e.g. /api/health"
            className="flex-1 bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={handleSendRequest}
            disabled={loading || !url.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{loading ? 'Sending...' : 'Send'}</span>
          </button>
        </div>

        {/* Headers and Body Editor Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
              Headers (JSON)
            </label>
            <textarea
              rows={4}
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg p-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {['POST', 'PUT'].includes(method) && (
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                JSON Payload Body
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg p-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          )}
        </div>

        {/* Response Viewer Panel */}
        <div className="flex-1 bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 flex flex-col space-y-3 min-h-[280px]">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
            <span className="font-bold text-zinc-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" /> Response Payload
            </span>

            {responseLog && (
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    responseLog.status >= 200 && responseLog.status < 300
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {responseLog.status} {responseLog.statusText}
                </span>

                <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                  <Clock className="w-3 h-3" /> {responseLog.timeMs} ms
                </span>

                <button
                  onClick={handleCopyResponse}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer ml-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-indigo-400 text-xs gap-2 py-8">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>Executing HTTP Request...</span>
              </div>
            ) : responseLog ? (
              <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {typeof responseLog.data === 'object'
                  ? JSON.stringify(responseLog.data, null, 2)
                  : String(responseLog.data)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 text-xs py-12">
                <Terminal className="w-8 h-8 mb-2 opacity-40" />
                <span>Click "Send" above to execute request and inspect HTTP headers & JSON responses.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
