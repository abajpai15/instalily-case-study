import React from 'react';
import { Layout, Typography } from 'antd';
import ChatInterface from './components/chat/ChatInterface';
import styled from 'styled-components';

const { Header, Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #007bff;
  padding: 0 24px;
  display: flex;
  align-items: center;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const App: React.FC = () => {
  return (
    <StyledLayout>
      <StyledHeader>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          PartSelect Chat Assistant
        </Title>
      </StyledHeader>
      <StyledContent>
        <ChatInterface />
      </StyledContent>
    </StyledLayout>
  );
};

export default App; 