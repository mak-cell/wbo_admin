import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, breakpoints } from '../styles/designTokens';
import { ApiService } from '../services/apiService';

interface PaymentRecord {
  id: number;
  project_id: number;
  milestone: string;
  amount: number;
  is_paid: boolean;
}

interface PayoutRecord {
  id: number;
  worker_id: number;
  project_id: number | null;
  amount: number;
  description: string;
  payout_date: string;
  is_paid: boolean;
}

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

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing[8]};
  color: ${colors.onSurface};
  opacity: 0.7;
`;

export default function Payments() {
  const [activeTab, setActiveTab] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'INCOME') {
          const data = await ApiService.getPayments();
          setPayments(data);
        } else {
          const data = await ApiService.getWorkerPayouts();
          setPayouts(data);
        }
      } catch (err) {
        console.error("Failed to load payment data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleMarkPaid = async (paymentId: number) => {
    try {
      await ApiService.updatePaymentStatus(paymentId, true);
      setPayments(payments.map(p => p.id === paymentId ? { ...p, is_paid: true } : p));
    } catch (err) {
      console.error("Failed to mark payment as paid:", err);
      alert("Failed to update payment status.");
    }
  };

  const handleMarkPayoutPaid = async (payoutId: number) => {
    try {
      await ApiService.updateWorkerPayoutStatus(payoutId, true);
      setPayouts(payouts.map(p => p.id === payoutId ? { ...p, is_paid: true } : p));
    } catch (err) {
      console.error("Failed to mark payout as paid:", err);
      alert("Failed to update payout status.");
    }
  };

  const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <PageHeader>
        <div>
          <h1>Finance Tracker</h1>
          <p>Track client payments and worker salaries/payouts.</p>
        </div>
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
        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : activeTab === 'INCOME' ? (
          payments.length === 0 ? (
            <EmptyState>No client payments recorded yet. Create a project via the Intake Form to get started.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Milestone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td><strong>Project #{payment.project_id}</strong></td>
                    <td>{payment.milestone}</td>
                    <td style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: colors.primary }}>
                      {formatCurrency(payment.amount)}
                    </td>
                    <td>
                      <StatusBadge status={payment.is_paid ? 'PAID' : 'PENDING'}>
                        {payment.is_paid ? 'PAID' : 'PENDING'}
                      </StatusBadge>
                    </td>
                    <td>
                      {!payment.is_paid && (
                        <Button 
                          variant="outline" 
                          style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                          onClick={() => handleMarkPaid(payment.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        ) : (
          payouts.length === 0 ? (
            <EmptyState>No worker payouts recorded yet.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Worker ID</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td><strong>Worker #{payout.worker_id}</strong></td>
                    <td>{payout.description}</td>
                    <td style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: colors.danger }}>
                      {formatCurrency(payout.amount)}
                    </td>
                    <td>{payout.payout_date}</td>
                    <td>
                      <StatusBadge status={payout.is_paid ? 'PAID' : 'PENDING'}>
                        {payout.is_paid ? 'PAID' : 'PENDING'}
                      </StatusBadge>
                    </td>
                    <td>
                      {!payout.is_paid && (
                        <Button 
                          variant="outline" 
                          style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                          onClick={() => handleMarkPayoutPaid(payout.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        )}
      </AnimatedCard>
    </Layout>
  );
}
