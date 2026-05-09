import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, breakpoints } from '../styles/designTokens';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedCard = styled(Card)`
  animation: ${fadeIn} 0.5s ease 0.2s both;
  overflow-x: auto;
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

  h1 {
    font-size: 2.5rem;
    margin-bottom: ${spacing[2]};
    color: ${colors.primary};
  }

  p {
    color: ${colors.onSurface};
    opacity: 0.8;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};
  border-bottom: 1px solid ${colors.border};
  padding-bottom: ${spacing[2]};
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? colors.primary : colors.onSurface};
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: ${spacing[2]} ${spacing[4]};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -${spacing[2]};
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.active ? colors.primary : 'transparent'};
    transition: all 0.2s ease;
  }

  &:hover {
    color: ${colors.primaryHover};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  
  th {
    padding: ${spacing[4]};
    color: ${colors.onSurface};
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    border-bottom: 1px solid ${colors.border};
  }

  td {
    padding: ${spacing[4]};
    color: ${colors.onBackground};
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.9rem;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span<{ status: 'PAID' | 'PENDING' }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.status === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  color: ${props => props.status === 'PAID' ? colors.success : colors.warning};
  border: 1px solid ${props => props.status === 'PAID' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'};
`;

export default function Payments() {
  const [activeTab, setActiveTab] = useState<'INCOME' | 'EXPENSE'>('INCOME');

  const incomeData = [
    { id: 1, client: "Rahul & Sneha", milestone: "Advance (20%)", amount: "₹ 50,000", date: "20 Oct 2023", status: "PAID" as const },
    { id: 2, client: "Ankita Wedding", milestone: "Final Delivery", amount: "₹ 30,000", date: "22 Oct 2023", status: "PENDING" as const },
  ];

  const expenseData = [
    { id: 1, worker: "Amit Kumar", type: "Monthly Salary", amount: "₹ 25,000", date: "01 Nov 2023", status: "PENDING" as const },
    { id: 2, worker: "Ramesh Singh", type: "Prewed Shoot (2 days)", amount: "₹ 6,000", date: "15 Oct 2023", status: "PAID" as const },
  ];

  return (
    <Layout>
      <PageHeader>
        <div>
          <h1>Finance Tracker</h1>
          <p>Track client payments and worker salaries/payouts.</p>
        </div>
        <Button variant="primary">
          {activeTab === 'INCOME' ? '+ Log Client Payment' : '+ Process Worker Payout'}
        </Button>
      </PageHeader>

      <TabContainer>
        <Tab active={activeTab === 'INCOME'} onClick={() => setActiveTab('INCOME')}>
          Income (Client Payments)
        </Tab>
        <Tab active={activeTab === 'EXPENSE'} onClick={() => setActiveTab('EXPENSE')}>
          Expenses (Worker Payouts)
        </Tab>
      </TabContainer>

      <AnimatedCard>
        <Table>
          <thead>
            <tr>
              <th>{activeTab === 'INCOME' ? 'Client / Project' : 'Worker'}</th>
              <th>{activeTab === 'INCOME' ? 'Milestone' : 'Description'}</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'INCOME' ? incomeData : expenseData).map((row: any) => (
              <tr key={row.id}>
                <td><strong>{row.client || row.worker}</strong></td>
                <td>{row.milestone || row.type}</td>
                <td style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: colors.primary }}>
                  {row.amount}
                </td>
                <td>{row.date}</td>
                <td><StatusBadge status={row.status}>{row.status}</StatusBadge></td>
                <td>
                  {row.status === 'PENDING' && (
                    <Button variant="outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                      Mark Paid
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </AnimatedCard>
    </Layout>
  );
}
