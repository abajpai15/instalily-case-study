import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Avatar, Typography, Space, Spin } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { chatService } from '../../services/chatService';

const { Text } = Typography;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const ChatContainer = styled(Card)`
  height: 600px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${props => props.isUser ? '#007bff' : '#f0f2f5'};
  color: ${props => props.isUser ? '#ffffff' : '#000000'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f2f5;
  border-radius: 12px;
  align-self: flex-start;
`;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.processMessage(inputValue);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error processing your request. Please try again later.',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message) => (
          <MessageBubble key={message.id} isUser={message.sender === 'user'}>
            <Avatar icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />} />
            <div>
              <Text style={{ color: message.sender === 'user' ? '#ffffff' : '#000000' }}>
                {message.content}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </div>
          </MessageBubble>
        ))}
        {isLoading && (
          <LoadingContainer>
            <Avatar icon={<RobotOutlined />} />
            <Spin size="small" />
          </LoadingContainer>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSendMessage}
          placeholder="Type your message here..."
          size="large"
          disabled={isLoading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          size="large"
          loading={isLoading}
          disabled={isLoading}
        />
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface; 