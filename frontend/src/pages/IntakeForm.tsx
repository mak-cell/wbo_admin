import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Layout from '../components/Layout';
import { Card, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, radius, breakpoints } from '../styles/designTokens';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageHeader = styled.div`
  margin-bottom: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease;

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

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
  max-width: 800px;
  animation: ${fadeIn} 0.5s ease 0.2s both;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.onBackground};
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  input, select, textarea {
    padding: ${spacing[3]} ${spacing[4]};
    border-radius: ${radius.md};
    border: 1px solid ${colors.border};
    background: rgba(255, 255, 255, 0.03);
    color: ${colors.onBackground};
    font-size: 1rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${colors.primary};
      background: rgba(212, 175, 55, 0.05);
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing[4]};

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const EventSection = styled.div`
  border-left: 2px solid ${colors.primary};
  padding-left: ${spacing[4]};
  margin-top: ${spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

export default function IntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Client project created successfully!");
    }, 1500);
  };

  return (
    <Layout>
      <PageHeader>
        <h1>New Client Intake</h1>
        <p>Register a new wedding project and generate a client portal link.</p>
      </PageHeader>

      <Card>
        <FormContainer onSubmit={handleSubmit}>
          <CardTitle>Client Details</CardTitle>
          <FormRow>
            <FormGroup>
              <label>Client Name(s)</label>
              <input type="text" placeholder="e.g. Rahul & Sneha" required />
            </FormGroup>
            <FormGroup>
              <label>Contact Number</label>
              <input type="tel" placeholder="+91" required />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <label>Instagram Reference (Optional)</label>
            <input type="text" placeholder="@username" />
          </FormGroup>

          <CardTitle style={{ marginTop: spacing[4] }}>Project Scope</CardTitle>
          <FormRow>
            <FormGroup>
              <label>Event Title</label>
              <input type="text" placeholder="e.g. 2-Day Wedding + Prewed" required />
            </FormGroup>
            <FormGroup>
              <label>Total Budget (INR)</label>
              <input type="number" placeholder="₹" required />
            </FormGroup>
          </FormRow>

          <CardTitle style={{ marginTop: spacing[4] }}>Events</CardTitle>
          <EventSection>
            <FormRow>
              <FormGroup>
                <label>Event 1 Type</label>
                <select>
                  <option>Pre-Wedding</option>
                  <option>Engagement</option>
                  <option>Haldi / Mehendi</option>
                  <option>Wedding</option>
                  <option>Reception</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Date & Location</label>
                <input type="text" placeholder="e.g. 24 Oct, Bhubaneswar" />
              </FormGroup>
            </FormRow>
            <Button type="button" variant="outline" style={{ width: 'fit-content' }}>+ Add Another Event</Button>
          </EventSection>

          <CardTitle style={{ marginTop: spacing[4] }}>Deliverables</CardTitle>
          <FormGroup>
            <label>Package Details</label>
            <textarea placeholder="Specify number of photos, cinematic video length, reels, album size, etc." required></textarea>
          </FormGroup>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[4], marginTop: spacing[4] }}>
            <Button type="button" variant="secondary">Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Project...' : 'Save & Generate Magic Link'}
            </Button>
          </div>
        </FormContainer>
      </Card>
    </Layout>
  );
}
