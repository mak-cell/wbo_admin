import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, radius, breakpoints } from '../styles/designTokens';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing[4]};
  }

  .title-group {
    h1 {
      font-size: 2.5rem;
      margin-bottom: ${spacing[2]};
      color: ${colors.primary};
    }
    p {
      color: ${colors.onSurface};
      opacity: 0.8;
    }
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${spacing[6]};
  animation: ${fadeIn} 0.5s ease 0.2s both;
`;

const WorkerProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[4]};
  
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${colors.surfaceHighlight};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: ${colors.primary};
    border: 2px solid ${colors.primary};
  }

  .info {
    h4 {
      margin: 0 0 4px 0;
      color: ${colors.onBackground};
      font-size: 1.1rem;
    }
    span {
      font-size: 0.8rem;
      color: ${colors.primaryHover};
      background: rgba(212, 175, 55, 0.1);
      padding: 2px 8px;
      border-radius: 12px;
    }
  }
`;

const WorkerStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing[3]};
  background: rgba(0,0,0,0.2);
  padding: ${spacing[3]};
  border-radius: ${radius.sm};
  margin-bottom: ${spacing[4]};

  .stat {
    display: flex;
    flex-direction: column;
    label {
      font-size: 0.7rem;
      color: ${colors.onSurface};
      text-transform: uppercase;
    }
    strong {
      color: ${colors.onBackground};
      font-size: 0.9rem;
    }
  }
`;

export default function Team() {
  const [workers] = useState([
    { id: 1, name: "Amit Kumar", role: "Lead Shooter", type: "SHOOTER", salary: "₹ 25,000/mo", joined: "Jan 2023", activeTasks: 2 },
    { id: 2, name: "Priya Das", role: "Senior Editor", type: "EDITOR", salary: "₹ 30,000/mo", joined: "Mar 2023", activeTasks: 5 },
    { id: 3, name: "Ramesh Singh", role: "Assistant Shooter", type: "SHOOTER", salary: "Per Shoot", joined: "Aug 2023", activeTasks: 1 },
    { id: 4, name: "Suman Jena", role: "Cinematographer", type: "SHOOTER", salary: "₹ 35,000/mo", joined: "Feb 2022", activeTasks: 0 },
  ]);

  return (
    <Layout>
      <PageHeader>
        <div className="title-group">
          <h1>HRMS & Team</h1>
          <p>Manage hierarchy, salaries, and assign tasks to shooters & editors.</p>
        </div>
        <Button variant="primary">+ Add Worker</Button>
      </PageHeader>

      <div style={{ marginBottom: spacing[6] }}>
        <h3 style={{ color: colors.onBackground, marginBottom: spacing[4], fontFamily: "'Playfair Display', serif" }}>
          Active Roster
        </h3>
        <TeamGrid>
          {workers.map(worker => (
            <Card key={worker.id}>
              <WorkerProfile>
                <div className="avatar">
                  {worker.name.charAt(0)}
                </div>
                <div className="info">
                  <h4>{worker.name}</h4>
                  <span>{worker.role}</span>
                </div>
              </WorkerProfile>

              <WorkerStats>
                <div className="stat">
                  <label>Base Pay</label>
                  <strong>{worker.salary}</strong>
                </div>
                <div className="stat">
                  <label>Joined</label>
                  <strong>{worker.joined}</strong>
                </div>
                <div className="stat">
                  <label>Active Tasks</label>
                  <strong>{worker.activeTasks} Assignments</strong>
                </div>
                <div className="stat">
                  <label>Type</label>
                  <strong>{worker.type}</strong>
                </div>
              </WorkerStats>

              <div style={{ display: 'flex', gap: spacing[2] }}>
                <Button variant="outline" style={{ flex: 1, padding: spacing[2], fontSize: '0.8rem' }}>Assign Task</Button>
                <Button variant="secondary" style={{ flex: 1, padding: spacing[2], fontSize: '0.8rem' }}>Pay Salary</Button>
              </div>
            </Card>
          ))}
        </TeamGrid>
      </div>
    </Layout>
  );
}
