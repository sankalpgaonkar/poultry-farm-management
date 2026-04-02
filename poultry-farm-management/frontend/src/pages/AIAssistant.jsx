import { useState, useRef, useEffect } from 'react';
import api from '../utils/axios';
import { Send, Bot, User } from 'lucide-react';

export default function AIAssistant({ isFloating = false }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Poultry Assistant. How can I help you improve your farm today?", sender: "ai" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: userMessage.text });
      
      setMessages(prev => [...prev, { text: data.reply, sender: 'ai' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I am facing connectivity issues right now.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${isFloating ? 'h-[450px] shadow-2xl rounded-2xl' : 'h-[calc(100vh-14rem)] rounded-xl'} bg-gray-50 overflow-hidden border border-gray-200`}>
      <div className="bg-brand-600 p-4 text-white flex gap-3 items-center">
        <Bot size={28} />
        <div>
          <h2 className="font-bold text-lg">AI Assistant</h2>
          <p className="text-xs text-brand-100">Smart insights and recommendations</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0"><Bot size={18} className="text-brand-600"/></div>}
            <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><User size={18} className="text-gray-600"/></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center"><Bot size={18} className="text-brand-600"/></div>
             <div className="bg-white border p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me about feed, temperatures, or diseases..." 
          className="flex-1 border px-4 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50"
        />
        <button type="submit" disabled={isLoading} className="bg-brand-600 text-white p-2.5 rounded-full hover:bg-brand-700 transition disabled:opacity-50">
          <Send size={18} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
}
