'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Trash2, 
  Info,
  AlertTriangle,
  CheckCircle2,
  Server
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  isLiveAI?: boolean;
  apiNotice?: string;
  source?: 'live-gemini' | 'pre-audited-telemetry' | 'api-fallback';
}

interface GeminiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PROMPTS = [
  'Why is Seoul server carbon high?',
  'Simulate migrating crawler from Virginia to London',
  'Explain GHG Protocol Scope 2 vs Scope 3 in our cloud',
  'What are top 3 immediate carbon-reduction actions?',
];

export default function GeminiCopilotDrawer({ isOpen, onClose }: GeminiCopilotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-01',
      role: 'model',
      text: `👋 Hello! I am your **GreenOps AI Copilot** connected to live RunCloud server telemetry across **Seoul, Frankfurt, Virginia, and London**.

Ask any question regarding your cloud carbon emissions, regional grid shifts, or ESG compliance audits.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'RunCloud ESG Intelligence',
      isLiveAI: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history: historyPayload }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
        isLiveAI: data.isLiveAI,
        apiNotice: data.apiNotice,
        source: data.source,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Copilot request failed:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: '⚠️ Network connection error. Unable to reach telemetry server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-cleared',
        role: 'model',
        text: 'Chat history cleared. What ESG optimization would you like to investigate?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'RunCloud ESG Intelligence',
        isLiveAI: false,
      },
    ]);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-emerald-400 text-xs mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <li key={idx} className="ml-3 list-disc text-slate-300 my-0.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-slate-300 leading-relaxed my-0.5">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-950 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-[10px] border border-slate-800">$1</code>');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white">Gemini ESG Copilot</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium font-mono">
                  Autonomous AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">RunCloud Server Telemetry & Decarbonization Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleClear}
              title="Clear Chat"
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/40 overflow-x-auto">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Suggested Investigations:</p>
          <div className="flex space-x-2 pb-1">
            {PRESET_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 hover:border-emerald-500/50 transition cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'model' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-3.5 ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/20'
                    : 'bg-slate-800/70 border border-slate-700/70 text-slate-200 rounded-bl-none'
                }`}
              >
                {/* Transparent API Notice Banner if present */}
                {m.apiNotice && (
                  <div className="mb-2.5 p-2 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-[10px] flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{m.apiNotice}</span>
                  </div>
                )}

                {m.role === 'model' ? (
                  <div>{renderFormattedText(m.text)}</div>
                ) : (
                  <p className="leading-relaxed">{m.text}</p>
                )}

                <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px] opacity-70">
                  <span>{m.timestamp}</span>
                  {m.modelUsed && (
                    <span className="font-mono text-[9px] flex items-center space-x-1 text-emerald-400">
                      {m.isLiveAI ? (
                        <span className="text-emerald-400 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                          Live {m.modelUsed}
                        </span>
                      ) : (
                        <span className="text-cyan-400 flex items-center">
                          <Server className="w-3 h-3 mr-1 text-cyan-400" />
                          {m.modelUsed}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl rounded-bl-none p-3 text-slate-400 flex items-center space-x-2">
                <span>Querying Google Gemini API & RunCloud node telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini about server carbon, crons, or ESG audit..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-emerald-500/20"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            100% Transparent ESG AI Engine • Live Gemini API + RunCloud Node Telemetry
          </p>
        </div>
      </div>
    </div>
  );
}
