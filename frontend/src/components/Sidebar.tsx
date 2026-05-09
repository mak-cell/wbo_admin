
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { colors, breakpoints, spacing } from '../styles/designTokens';

const SidebarContainer = styled.nav`
  width: 260px;
  background: ${colors.surface};
  border-right: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  @media (max-width: ${breakpoints.md}) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    border-right: none;
    border-top: 1px solid ${colors.border};
    flex-direction: row;
    z-index: 100;
    background: ${colors.glass};
    backdrop-filter: blur(15px);
  }
`;

const LogoSection = styled.div`
  padding: ${spacing[8]};
  text-align: center;
  border-bottom: 1px solid ${colors.border};
  
  h1 {
    color: ${colors.primary};
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }

  p {
    color: ${colors.onSurface};
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: ${spacing[2]};
  }

  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

const NavLinks = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${spacing[4]};
  gap: ${spacing[2]};

  @media (max-width: ${breakpoints.md}) {
    flex-direction: row;
    padding: 0 ${spacing[2]};
    justify-content: space-around;
    align-items: center;
    gap: 0;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: 8px;
  color: ${colors.onSurface};
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: ${colors.primary};
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  &:hover {
    background: ${colors.surfaceHighlight};
    color: ${colors.primaryHover};
  }

  &.active {
    background: rgba(212, 175, 55, 0.1);
    color: ${colors.primary};
    &::before {
      transform: scaleY(1);
    }
  }

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    padding: ${spacing[2]};
    font-size: 0.7rem;
    flex: 1;
    text-align: center;
    border-radius: 0;
    justify-content: center;

    &::before {
      width: 100%;
      height: 3px;
      top: 0;
      left: 0;
      transform: scaleX(0);
      transition: transform 0.2s ease;
    }

    &.active {
      background: transparent;
      &::before {
        transform: scaleX(1);
      }
    }
  }
`;

const IconWrapper = styled.span`
  margin-right: ${spacing[3]};
  font-size: 1.2rem;

  @media (max-width: ${breakpoints.md}) {
    margin-right: 0;
    margin-bottom: 2px;
    font-size: 1.2rem;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoSection>
        <h1>Wedding Bell</h1>
        <p>Odisha Studio Management</p>
      </LogoSection>
      <NavLinks>
        <StyledNavLink to="/dashboard">
          <IconWrapper>📊</IconWrapper>
          <span>Dashboard</span>
        </StyledNavLink>
        <StyledNavLink to="/projects">
          <IconWrapper>📸</IconWrapper>
          <span>Projects</span>
        </StyledNavLink>
        <StyledNavLink to="/intake-form">
          <IconWrapper>📝</IconWrapper>
          <span>Intake</span>
        </StyledNavLink>
        <StyledNavLink to="/calendar">
          <IconWrapper>📅</IconWrapper>
          <span>Calendar</span>
        </StyledNavLink>
        <StyledNavLink to="/team">
          <IconWrapper>👥</IconWrapper>
          <span>Team</span>
        </StyledNavLink>
        <StyledNavLink to="/payments">
          <IconWrapper>💰</IconWrapper>
          <span>Finance</span>
        </StyledNavLink>
      </NavLinks>
    </SidebarContainer>
  );
};

export default Sidebar;
