import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { chatService } from "../services/chatService.ts";
import { marked } from "marked";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function ChatWindow() {
  const defaultMessage: Message[] = [{
    role: "assistant",
    content: "Hi, how can I help you today?"
  }];

  const [messages, setMessages] = useState<Message[]>(defaultMessage);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  const handleSend = async (input: string) => {
    if (input.trim() !== "" && !isLoading) {
      // Set user message
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      setInput("");
      setIsLoading(true);

      try {
        // Call chatService & set assistant message
        const response = await chatService.processMessage(input);
        setMessages(prevMessages => [...prevMessages, { role: "assistant", content: response }]);
      } catch (error) {
        console.error("Error processing message:", error);
        setMessages(prevMessages => [...prevMessages, { 
          role: "assistant", 
          content: "I apologize, but I encountered an error processing your request. Please try again later." 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-content">
          <h1>PartSelect Assistant</h1>
          <p>Your expert for refrigerator and dishwasher parts</p>
        </div>
      </header>
      <div className="messages-container">
          {messages.map((message, index) => (
              <div key={index} className={`${message.role}-message-container`}>
                  {message.content && (
                      <div className={`message ${message.role}-message`}>
                          <div dangerouslySetInnerHTML={{__html: marked(message.content).replace(/<p>|<\/p>/g, "")}}></div>
                      </div>
                  )}
              </div>
          ))}
          {isLoading && (
            <div className="assistant-message-container">
              <div className="message assistant-message">
                <div>Thinking...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(input);
              e.preventDefault();
            }
          }}
          disabled={isLoading}
        />
        <button 
          className="send-button" 
          onClick={() => handleSend(input)}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatWindow; 