import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { Card, CardTitle, CardContent } from '../components/Card';
import { colors, spacing, breakpoints, radius } from '../styles/designTokens';
import { ApiService } from '../services/apiService';
import { DashboardSummary, Project } from '../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedCard = styled(Card)<{ $delay: string }>`
  animation: ${fadeIn} 0.5s ease ${props => props.$delay} both;
`;

const PageHeader = styled.div`
  margin-bottom: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease;

  h1 {
    font-size: 2.5rem;
    margin-bottom: ${spacing[2]};
    background: linear-gradient(to right, ${colors.primary}, ${colors.primaryHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: ${colors.onSurface};
    opacity: 0.8;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${spacing[6]};
  margin-bottom: ${spacing[8]};
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
  color: ${colors.onBackground};
  margin: ${spacing[2]} 0;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.onSurface};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActivitySection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${spacing[6]};

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[4]};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${radius.md};
  border-left: 4px solid ${colors.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      color: ${colors.onBackground};
    }
    span {
      font-size: 0.8rem;
      color: ${colors.onSurface};
      opacity: 0.7;
    }
  }

  .status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(212, 175, 55, 0.2);
    color: ${colors.primary};
  }
`;

const LoadingPulse = styled.div`
  color: ${colors.onSurface};
  text-align: center;
  padding: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease;
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryData, projectsData] = await Promise.all([
          ApiService.getDashboard(),
          ApiService.getProjects(),
        ]);
        setSummary(summaryData);
        // Show latest 5 projects as recent activity
        setRecentProjects(projectsData.slice(-5).reverse());
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Layout>
      <PageHeader>
        <h1>Studio Overview</h1>
        <p>Welcome back to Wedding Bell Odisha Dashboard</p>
      </PageHeader>

      {loading ? (
        <LoadingPulse>Loading dashboard data...</LoadingPulse>
      ) : (
        <>
          <MetricsGrid>
            <AnimatedCard $delay="0.1s">
              <MetricLabel>Active Projects</MetricLabel>
              <MetricValue>{summary?.active_projects ?? 0}</MetricValue>
              <CardContent>of {summary?.total_projects ?? 0} total</CardContent>
            </AnimatedCard>
            <AnimatedCard $delay="0.2s">
              <MetricLabel>Total Revenue</MetricLabel>
              <MetricValue>{formatCurrency(summary?.total_revenue ?? 0)}</MetricValue>
              <CardContent>Payments received</CardContent>
            </AnimatedCard>
            <AnimatedCard $delay="0.3s">
              <MetricLabel>Pending Payments</MetricLabel>
              <MetricValue style={{ color: colors.warning }}>{formatCurrency(summary?.pending_payments ?? 0)}</MetricValue>
              <CardContent>Outstanding balance</CardContent>
            </AnimatedCard>
            <AnimatedCard $delay="0.4s">
              <MetricLabel>Delivered</MetricLabel>
              <MetricValue>{summary?.completed_deliverables ?? 0}</MetricValue>
              <CardContent>Projects delivered to clients</CardContent>
            </AnimatedCard>
          </MetricsGrid>

          <ActivitySection>
            <AnimatedCard $delay="0.5s">
              <CardTitle>Recent Projects</CardTitle>
              <ActivityList>
                {recentProjects.length === 0 ? (
                  <div style={{ color: colors.onSurface, opacity: 0.7, padding: spacing[4] }}>
                    No projects yet. Create your first intake!
                  </div>
                ) : (
                  recentProjects.map((project) => (
                    <ActivityItem key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                      <div className="details">
                        <strong>{project.client_name}</strong>
                        <span>{project.event_title || "Wedding Coverage"} • {project.location}</span>
                      </div>
                      <div className="status">{project.status}</div>
                    </ActivityItem>
                  ))
                )}
              </ActivityList>
            </AnimatedCard>
            
            <AnimatedCard $delay="0.6s">
              <CardTitle>Quick Actions</CardTitle>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                <button 
                  onClick={() => navigate("/intake-form")}
                  style={{ 
                  padding: spacing[3], 
                  background: colors.primary, 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: radius.md,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>+ New Client Intake</button>
                <button 
                  onClick={() => navigate("/payments")}
                  style={{ 
                  padding: spacing[3], 
                  background: 'transparent', 
                  color: colors.primary, 
                  border: `1px solid ${colors.primary}`, 
                  borderRadius: radius.md,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>Log Payment</button>
              </CardContent>
            </AnimatedCard>
          </ActivitySection>
        </>
      )}
    </Layout>
  );
}
