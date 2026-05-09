import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { colors, spacing, radius, breakpoints } from "../styles/designTokens";
import { ApiService } from "../services/apiService";
import { Project, ProjectStatus } from "../types";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageHeader = styled.div`
  margin-bottom: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing[4]};
  }
`;

const HeaderText = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: ${spacing[2]};
    background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p {
    color: ${colors.onSurface};
    opacity: 0.8;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${spacing[2]};
  background: rgba(255, 255, 255, 0.02);
  padding: 4px;
  border-radius: 30px;
  border: 1px solid ${colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: ${({ $active }) => ($active ? colors.primary : "transparent")};
  color: ${({ $active }) => ($active ? colors.background : colors.onSurface)};
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ $active }) => ($active ? colors.background : colors.primary)};
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${spacing[6]};
`;

const ProjectCard = styled.div<{ $delay: number }>`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${spacing[6]};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  animation: ${fadeIn} 0.5s ease ${({ $delay }) => $delay * 0.1}s both;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${colors.primary};
    transform: scaleY(0);
    transition: transform 0.3s ease;
    transform-origin: bottom;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border-color: rgba(212, 175, 55, 0.3);

    &::before {
      transform: scaleY(1);
    }

    .arrow-icon {
      transform: translateX(4px);
      color: ${colors.primary};
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing[4]};
`;

const ClientName = styled.h3`
  font-size: 1.25rem;
  color: ${colors.onBackground};
  margin: 0;
  line-height: 1.2;
`;

const EventTitle = styled.p`
  font-size: 0.85rem;
  color: ${colors.primary};
  margin-top: 4px;
  font-weight: 500;
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  background: ${({ status }) => {
    switch (status) {
      case "DELIVERED": return 'rgba(16, 185, 129, 0.1)';
      case "IN_PROGRESS": return 'rgba(59, 130, 246, 0.1)';
      case "REVIEW": return 'rgba(139, 92, 246, 0.1)';
      default: return 'rgba(245, 158, 11, 0.1)';
    }
  }};
  
  color: ${({ status }) => {
    switch (status) {
      case "DELIVERED": return colors.success;
      case "IN_PROGRESS": return colors.info;
      case "REVIEW": return '#c084fc'; // Purple
      default: return colors.warning;
    }
  }};
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[4]};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  font-size: 0.9rem;
  color: ${colors.onSurface};

  span.icon {
    opacity: 0.7;
    font-size: 1rem;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${spacing[4]};
  border-top: 1px solid ${colors.border};
  color: ${colors.onSurface};
  font-size: 0.85rem;
  font-weight: 600;

  .arrow-icon {
    transition: all 0.3s ease;
    font-size: 1.2rem;
  }
`;

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ApiService.getProjects();
        setProjects(data);
      } catch (err) {
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") return p.status !== ProjectStatus.DELIVERED;
    if (filter === "COMPLETED") return p.status === ProjectStatus.DELIVERED;
    return true;
  });

  if (loading) return (
    <Layout>
      <PageHeader>
        <HeaderText>
          <h1>Projects</h1>
          <p>Loading your amazing work...</p>
        </HeaderText>
      </PageHeader>
    </Layout>
  );

  if (error) return (
    <Layout>
      <PageHeader>
        <HeaderText>
          <h1>Projects</h1>
          <p style={{ color: colors.danger }}>{error}</p>
        </HeaderText>
      </PageHeader>
    </Layout>
  );

  return (
    <Layout>
      <PageHeader>
        <HeaderText>
          <h1>Projects Tracker</h1>
          <p>Manage all your studio assignments from shoot to delivery.</p>
        </HeaderText>
        <FilterTabs>
          <Tab $active={filter === "ALL"} onClick={() => setFilter("ALL")}>All</Tab>
          <Tab $active={filter === "ACTIVE"} onClick={() => setFilter("ACTIVE")}>Active</Tab>
          <Tab $active={filter === "COMPLETED"} onClick={() => setFilter("COMPLETED")}>Completed</Tab>
        </FilterTabs>
      </PageHeader>

      <ProjectGrid>
        {filteredProjects.length === 0 && (
          <div style={{ color: colors.onSurface, padding: spacing[4], gridColumn: '1 / -1', textAlign: 'center' }}>
            <p>No projects match this filter.</p>
          </div>
        )}
        {filteredProjects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            $delay={index}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <CardHeader>
              <div>
                <ClientName>{project.client_name}</ClientName>
                <EventTitle>{project.event_title || "Wedding Coverage"}</EventTitle>
              </div>
              <StatusBadge status={project.status}>
                {project.status.replace("_", " ")}
              </StatusBadge>
            </CardHeader>
            
            <CardBody>
              <InfoRow>
                <span className="icon">📍</span>
                {project.location}
              </InfoRow>
              <InfoRow>
                <span className="icon">📞</span>
                {project.contact_number}
              </InfoRow>
            </CardBody>

            <CardFooter>
              <span>Budget: ₹{project.total_budget.toLocaleString()}</span>
              <span className="arrow-icon">→</span>
            </CardFooter>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </Layout>
  );
};

export default Projects;
