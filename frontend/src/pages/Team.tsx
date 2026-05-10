import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, radius, breakpoints } from '../styles/designTokens';
import { ApiService } from '../services/apiService';

interface UserRecord {
  id: number;
  name: string;
  contact: string;
  role: string;
  base_salary: number;
  joining_date: string | null;
}

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalContent = styled(Card)`
  width: 400px;
  max-width: 90vw;
  padding: ${spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};

  h3 {
    font-size: 1.5rem;
    color: ${colors.primary};
    margin: 0;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${colors.onSurface};
  }

  input, select {
    padding: 10px 14px;
    border-radius: ${radius.md};
    border: 1px solid ${colors.border};
    background: ${colors.surface};
    color: ${colors.onBackground};
    font-size: 0.95rem;

    &:focus { outline: none; border-color: ${colors.primary}; }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing[8]};
  color: ${colors.onSurface};
  opacity: 0.7;
  grid-column: 1 / -1;
`;

export default function Team() {
  const [workers, setWorkers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', contact: '', role: 'Shooter', base_salary: 0 });
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkers = async () => {
    try {
      const data = await ApiService.getUsers();
      setWorkers(data);
    } catch (err) {
      console.error("Failed to load team data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleAddWorker = async () => {
    if (!newWorker.name || !newWorker.contact) {
      alert("Name and Contact are required.");
      return;
    }

    setSubmitting(true);
    try {
      await ApiService.createUser(newWorker);
      setShowAddModal(false);
      setNewWorker({ name: '', contact: '', role: 'Shooter', base_salary: 0 });
      await fetchWorkers();
    } catch (err) {
      console.error("Failed to add worker:", err);
      alert("Failed to add worker. Contact number may already exist.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (salary: number) => {
    if (salary === 0) return "Per Shoot";
    return `₹ ${salary.toLocaleString('en-IN')}/mo`;
  };

  return (
    <Layout>
      <PageHeader>
        <div className="title-group">
          <h1>HRMS & Team</h1>
          <p>Manage hierarchy, salaries, and assign tasks to shooters & editors.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>+ Add Worker</Button>
      </PageHeader>

      <div style={{ marginBottom: spacing[6] }}>
        <h3 style={{ color: colors.onBackground, marginBottom: spacing[4], fontFamily: "'Playfair Display', serif" }}>
          Active Roster
        </h3>
        <TeamGrid>
          {loading ? (
            <EmptyState>Loading team data...</EmptyState>
          ) : workers.length === 0 ? (
            <EmptyState>No team members yet. Click "+ Add Worker" to get started.</EmptyState>
          ) : (
            workers.map(worker => (
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
                    <strong>{formatSalary(worker.base_salary)}</strong>
                  </div>
                  <div className="stat">
                    <label>Joined</label>
                    <strong>{worker.joining_date || "N/A"}</strong>
                  </div>
                  <div className="stat">
                    <label>Contact</label>
                    <strong>{worker.contact}</strong>
                  </div>
                  <div className="stat">
                    <label>ID</label>
                    <strong>#{worker.id}</strong>
                  </div>
                </WorkerStats>
              </Card>
            ))
          )}
        </TeamGrid>
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <ModalOverlay onClick={() => setShowAddModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>Add Team Member</h3>
            <FormGroup>
              <label>Full Name *</label>
              <input
                type="text"
                value={newWorker.name}
                onChange={e => setNewWorker({ ...newWorker, name: e.target.value })}
                placeholder="e.g. Amit Kumar"
              />
            </FormGroup>
            <FormGroup>
              <label>Contact Number *</label>
              <input
                type="tel"
                value={newWorker.contact}
                onChange={e => setNewWorker({ ...newWorker, contact: e.target.value })}
                placeholder="e.g. 9876543210"
              />
            </FormGroup>
            <FormGroup>
              <label>Role</label>
              <select
                value={newWorker.role}
                onChange={e => setNewWorker({ ...newWorker, role: e.target.value })}
              >
                <option value="Admin">Admin</option>
                <option value="Shooter">Shooter</option>
                <option value="Editor">Editor</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Base Salary (₹/month, 0 for per-shoot)</label>
              <input
                type="number"
                value={newWorker.base_salary}
                onChange={e => setNewWorker({ ...newWorker, base_salary: Number(e.target.value) })}
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end', marginTop: spacing[2] }}>
              <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" type="button" onClick={handleAddWorker} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Worker'}
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
}
