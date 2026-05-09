import styled from "styled-components";
import { colors, spacing, radius, shadows } from "../styles/designTokens";

export const Card = styled.div`
  background: ${colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${spacing[6]};
  box-shadow: ${shadows.md};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${shadows.glow};
    border-color: rgba(212, 175, 55, 0.3);
    transform: translateY(-4px);
  }
`;

export const CardTitle = styled.h3`
  font-family: "Playfair Display", serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.primary};
  margin: 0 0 ${spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

export const CardContent = styled.div`
  font-family: "Manrope", sans-serif;
  color: ${colors.onSurface};
  font-size: 0.875rem;
  line-height: 1.6;
`;
