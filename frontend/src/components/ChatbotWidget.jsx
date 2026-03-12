import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Namaste! I'm your MandiConnect AI assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('chatbot/', { message: userMessage });
      const botReply = response.data.response;
      setMessages(prev => [...prev, { text: botReply, isBot: true }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { text: "I'm having trouble connecting right now. Please contact platform support for further assistance.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window card">
          <div className="chatbot-header">
            <h4>Mandi Assistant</h4>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} title="Close Chat">
              &times;
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.isBot ? 'bot-message' : 'user-message'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message bot-message loading-indicator">
                <span className="typing-dots">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How do I add crops?..."
              className="chatbot-input"
              disabled={isLoading}
              autoFocus
            />
            <button type="submit" className="chatbot-send-btn" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)} title="Need help?">
          <span className="chatbot-icon">🤖</span>
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
