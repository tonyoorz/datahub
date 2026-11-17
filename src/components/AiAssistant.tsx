'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    X,
    Send,
    Bot,
    User,
    Loader2,
    ChevronDown,
    MessageSquare,
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const SUGGESTIONS = [
    '推荐一个免费的 BI 工具',
    '5人创业团队适合用什么数据工具？',
    '哪个爬虫框架适合 Python 开发者？',
    'Tableau 和 Power BI 哪个更好？',
];

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content:
                '你好！我是 DataHub AI 选型助手 👋\n\n我可以帮你根据需求推荐最合适的数据工具，比如 BI 平台、可视化库或爬虫框架。\n\n**请描述你的需求，或选择下方快捷问题开始。**',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            inputRef.current?.focus();
            setHasNewMessage(false);
        }
    }, [isOpen, messages]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setInput('');
        setIsLoading(true);
        scrollToBottom();

        abortRef.current = new AbortController();

        try {
            const historyMessages = [...messages, userMessage]
                .filter((m) => m.id !== 'welcome')
                .map((m) => ({ role: m.role, content: m.content }));

            const res = await fetch('/api/ai/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: historyMessages }),
                signal: abortRef.current.signal,
            });

            if (!res.ok || !res.body) {
                throw new Error('请求失败');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (data === '[DONE]') break;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                accumulated += parsed.content;
                                setMessages((prev) =>
                                    prev.map((m) =>
                                        m.id === assistantMessage.id
                                            ? { ...m, content: accumulated }
                                            : m
                                    )
                                );
                            }
                        } catch {
                            // skip
                        }
                    }
                }
            }

            if (!isOpen) setHasNewMessage(true);
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMessage.id
                            ? {
                                ...m,
                                content: '❌ 请求失败，请检查 API Key 配置或网络连接后重试。',
                            }
                            : m
                    )
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const renderMarkdown = (text: string) => {
        // Simple markdown-like rendering
        const lines = text.split('\n');
        return lines.map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
                return (
                    <p key={i} className="font-semibold text-slate-100 mt-2">
                        {line.slice(2, -2)}
                    </p>
                );
            }
            if (line.startsWith('- ') || line.startsWith('• ')) {
                return (
                    <li key={i} className="ml-3 list-disc text-slate-200">
                        {parseInlineMarkdown(line.slice(2))}
                    </li>
                );
            }
            if (line.startsWith('### ')) {
                return (
                    <p key={i} className="font-semibold text-blue-300 mt-3 text-sm">
                        {line.slice(4)}
                    </p>
                );
            }
            if (line === '') return <br key={i} />;
            return (
                <p key={i} className="text-slate-200 leading-relaxed">
                    {parseInlineMarkdown(line)}
                </p>
            );
        });
    };

    const parseInlineMarkdown = (text: string) => {
        // Replace **bold** patterns
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={i} className="font-semibold text-white">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });
    };

    return (
        <>
            {/* Floating Button */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={() => setIsOpen(true)}
                            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                            aria-label="打开 AI 选型助手"
                        >
                            {/* Pulse ring */}
                            <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
                            <MessageSquare className="h-6 w-6 text-white" />
                            {hasNewMessage && (
                                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white" />
                            )}
                            {/* Tooltip */}
                            <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                AI 选型助手
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] max-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 sm:w-[420px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 px-4 py-3.5 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-sm">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">AI 选型助手</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <p className="text-xs text-slate-400">由 GLM-4 驱动</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                    aria-label="最小化"
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        abortRef.current?.abort();
                                        setIsOpen(false);
                                    }}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                    aria-label="关闭"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${msg.role === 'assistant'
                                                ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                                                : 'bg-slate-700'
                                            }`}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <Bot className="h-4 w-4 text-white" />
                                        ) : (
                                            <User className="h-3.5 w-3.5 text-slate-300" />
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                                ? 'rounded-tr-sm bg-blue-600 text-white'
                                                : 'rounded-tl-sm bg-slate-800 text-slate-200'
                                            }`}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <div className="text-sm space-y-1">
                                                {msg.content ? (
                                                    renderMarkdown(msg.content)
                                                ) : (
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        <span className="text-xs">正在思考...</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm">{msg.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Suggestions (show only at start) */}
                            {messages.length === 1 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-slate-500 px-1">快捷问题</p>
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => sendMessage(s)}
                                            className="w-full rounded-xl border border-white/8 bg-slate-800/60 px-3 py-2.5 text-left text-sm text-slate-300 transition-colors hover:border-blue-500/40 hover:bg-slate-800 hover:text-white"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-white/10 bg-slate-900/80 p-3 backdrop-blur-sm">
                            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-slate-800 p-2">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="描述你的需求..."
                                    rows={1}
                                    disabled={isLoading}
                                    className="flex-1 resize-none bg-transparent text-sm text-white placeholder-slate-500 outline-none disabled:opacity-50 max-h-28"
                                    style={{ minHeight: '24px' }}
                                    onInput={(e) => {
                                        const el = e.currentTarget;
                                        el.style.height = 'auto';
                                        el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
                                    }}
                                />
                                <button
                                    onClick={() => sendMessage(input)}
                                    disabled={!input.trim() || isLoading}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="发送"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Send className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>
                            <p className="mt-1.5 text-center text-[10px] text-slate-600">
                                Enter 发送 · Shift+Enter 换行 · 由 智谱 GLM-4 驱动
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
