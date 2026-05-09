import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { Card, CardTitle, CardContent } from '../components/Card';
import { colors, spacing, breakpoints, radius } from '../styles/designTokens';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics] = useState({
    activeProjects: 12,
    totalRevenue: "₹ 8,50,000",
    pendingPayments: "₹ 1,20,000",
    activeWorkers: 8
  });

  // Mock data for recent activity
  const activities = [
    { id: 1, title: "Rahul & Sneha Prewed", type: "New Project", date: "Today, 10:30 AM", status: "Active", link: "/projects/1" },
    { id: 2, title: "Payment Received", type: "Milestone: Advance", date: "Yesterday", status: "Completed", link: "/payments" },
    { id: 3, title: "Ankita Wedding Edit", type: "Task Assigned", date: "Yesterday", status: "Pending", link: "/tasks" },
  ];

  return (
    <Layout>
      <PageHeader>
        <h1>Studio Overview</h1>
        <p>Welcome back to Wedding Bell Odisha Dashboard</p>
      </PageHeader>

      <MetricsGrid>
        <AnimatedCard $delay="0.1s">
          <MetricLabel>Active Projects</MetricLabel>
          <MetricValue>{metrics.activeProjects}</MetricValue>
          <CardContent>+2 from last month</CardContent>
        </AnimatedCard>
        <AnimatedCard $delay="0.2s">
          <MetricLabel>Total Revenue</MetricLabel>
          <MetricValue>{metrics.totalRevenue}</MetricValue>
          <CardContent>This financial year</CardContent>
        </AnimatedCard>
        <AnimatedCard $delay="0.3s">
          <MetricLabel>Pending Payments</MetricLabel>
          <MetricValue style={{ color: colors.warning }}>{metrics.pendingPayments}</MetricValue>
          <CardContent>From 4 clients</CardContent>
        </AnimatedCard>
        <AnimatedCard $delay="0.4s">
          <MetricLabel>Active Team</MetricLabel>
          <MetricValue>{metrics.activeWorkers}</MetricValue>
          <CardContent>6 Shooters, 2 Editors on duty</CardContent>
        </AnimatedCard>
      </MetricsGrid>

      <ActivitySection>
        <AnimatedCard $delay="0.5s">
          <CardTitle>Recent Activity</CardTitle>
          <ActivityList>
            {activities.map((act) => (
              <ActivityItem key={act.id} onClick={() => navigate(act.link)}>
                <div className="details">
                  <strong>{act.title}</strong>
                  <span>{act.type} • {act.date}</span>
                </div>
                <div className="status">{act.status}</div>
              </ActivityItem>
            ))}
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
    </Layout>
  );
}
