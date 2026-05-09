/**
 * App Component
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { colors } from "./styles/designTokens";

// Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import IntakeForm from "./pages/IntakeForm";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Payments from "./pages/Payments";
import Team from "./pages/Team";

// Global styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@400;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    background-color: ${colors.background};
    color: ${colors.onSurface};
    font-family: "Manrope", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Playfair Display", serif;
    color: ${colors.onBackground};
    font-weight: 700;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    background: transparent;
  }

  /* Custom Scrollbar for modern look */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${colors.background};
  }
  ::-webkit-scrollbar-thumb {
    background: ${colors.surfaceHighlight};
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.primary};
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/intake-form" element={<IntakeForm />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/team" element={<Team />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
