import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { colors, breakpoints } from '../styles/designTokens';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: radial-gradient(circle at top right, ${colors.surfaceHighlight}, ${colors.background});
  
  @media (max-width: ${breakpoints.md}) {
    padding: 1rem;
    padding-bottom: 5rem; /* space for bottom nav */
  }
`;

const TopBar = styled.div`
  display: none;
  
  @media (max-width: ${breakpoints.md}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: ${colors.glass};
    backdrop-filter: blur(10px);
    border-bottom: 1px solid ${colors.border};
    position: sticky;
    top: 0;
    z-index: 10;
  }
`;

const LogoText = styled.h2`
  color: ${colors.primary};
  margin: 0;
  font-size: 1.25rem;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <TopBar>
          <LogoText>Wedding Bell</LogoText>
        </TopBar>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
