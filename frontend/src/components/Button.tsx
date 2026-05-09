import styled from "styled-components";
import { colors, spacing, radius } from "../styles/designTokens";

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' | 'danger' }>`
  padding: ${spacing[3]} ${spacing[6]};
  border-radius: ${radius.md};
  font-family: "Manrope", sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${colors.surfaceHighlight};
          color: ${colors.onSurface};
          border: 1px solid ${colors.border};
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${colors.primary};
          border: 1px solid ${colors.primary};
          &:hover {
            background: rgba(212, 175, 55, 0.1);
          }
        `;
      case 'danger':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: ${colors.danger};
          border: 1px solid rgba(239, 68, 68, 0.3);
          &:hover {
            background: rgba(239, 68, 68, 0.2);
          }
        `;
      case 'primary':
      default:
        return `
          background: ${colors.primary};
          color: #000000;
          border: none;
          &:hover {
            background: ${colors.primaryHover};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
