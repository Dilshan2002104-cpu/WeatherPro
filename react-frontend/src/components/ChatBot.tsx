import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatBotProps {
    city?: string;
    includeForecast?: boolean;
}

export const ChatBot = ({ city, includeForecast = false }: ChatBotProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    message: input,
                    city: city,
                    include_forecast: includeForecast,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: '❌ Sorry, I encountered an error. Please make sure the Python backend is running on port 8000.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = async () => {
        try {
            await fetch(`http://localhost:8000/api/chat/clear/${sessionId}`, {
                method: 'POST',
            });
            setMessages([]);
        } catch (error) {
            console.error('Failed to clear chat:', error);
        }
    };

    const suggestedPrompts = [
        "Will I need an umbrella today?",
        "What should I wear tomorrow?",
        "Is it good weather for outdoor activities?",
        "Explain today's weather pattern",
        "Should I plan indoor or outdoor activities?",
    ];

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gradient-cyan flex items-center gap-2">
                        🤖 AI Weather Assistant
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                        Powered by Gemini 2.0 Flash
                    </p>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        className="btn-ghost text-xs"
                    >
                        Clear Chat
                    </button>
                )}
            </div>

            {/* Messages Container */}
            <div className="card-dark-elevated h-[500px] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-[var(--text-secondary)] py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <p className="text-lg text-white mb-2">Ask me anything about the weather!</p>
                        <p className="text-sm mb-6">I can help you plan your day based on weather conditions.</p>

                        {/* Suggested Prompts */}
                        <div className="space-y-2 max-w-md mx-auto">
                            <p className="text-xs text-[var(--text-muted)] mb-3">Try asking:</p>
                            {suggestedPrompts.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(prompt)}
                                    className="w-full text-left px-4 py-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white transition-all duration-200 text-sm"
                                >
                                    💡 {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                        <div
                            className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-[var(--accent-cyan)] text-[#0a0e27] font-medium'
                                    : 'bg-[var(--bg-secondary)] text-white border border-[var(--border-subtle)]'
                                }`}
                        >
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-[#0a0e27]/60' : 'text-[var(--text-muted)]'
                                }`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4 rounded-2xl">
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                <span className="text-[var(--text-secondary)] text-sm ml-2">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about the weather..."
                    className="input-dark flex-1 resize-none h-12 py-3"
                    disabled={loading}
                    rows={1}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : (
                        'Send'
                    )}
                </button>
            </div>

            {/* Info Footer */}
            {city && (
                <div className="text-center text-xs text-[var(--text-muted)]">
                    💡 AI has access to {city}'s current weather{includeForecast && ' and 5-day forecast'}
                </div>
            )}
        </div>
    );
};
