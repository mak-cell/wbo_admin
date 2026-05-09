import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Layout from "../components/Layout";
import { Card, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { colors, spacing, radius } from "../styles/designTokens";
import { ApiService } from "../services/apiService";
import { Project, ProjectStatus, Payment } from "../types";

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
`;

const Form = styled.form`
  display: grid;
  gap: ${spacing[6]};
  animation: ${fadeIn} 0.5s ease 0.2s both;
`;

const Section = styled(Card)``;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${spacing[4]};
  color: ${colors.primary};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.onBackground};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${spacing[2]};
`;

const Input = styled.input`
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
  }
`;

const Select = styled.select`
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${colors.onBackground};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  
  option {
    background: ${colors.surface};
  }
`;

const TextArea = styled.textarea`
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${colors.onBackground};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const Badge = styled.span<{ status?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${({ status }) =>
    status === "Past"
      ? 'rgba(239, 68, 68, 0.1)'
      : status === "Today"
      ? 'rgba(212, 175, 55, 0.1)'
      : 'rgba(59, 130, 246, 0.1)'
  };
  color: ${({ status }) => (
    status === "Past" ? colors.danger : status === "Today" ? colors.primary : colors.info
  )};
`;

const ListSection = styled.div`
  display: grid;
  gap: ${spacing[4]};
`;

const MiniCard = styled.div`
  padding: ${spacing[4]};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${radius.md};
  border-left: 2px solid ${colors.primary};
`;

const LinkBack = styled(Link)`
  display: inline-block;
  margin-bottom: ${spacing[4]};
  color: ${colors.primaryHover};
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  color: ${colors.danger};
  margin-top: ${spacing[4]};
`;

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deliverableDetailsText, setDeliverableDetailsText] = useState<string[]>([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!projectId) return;
        const data = (await ApiService.getProject(Number(projectId))) as Project;
        setProject(data);
        setDeliverableDetailsText(
          data.deliverables.map((deliverable) =>
            JSON.stringify(deliverable.details || {}, null, 2)
          )
        );
      } catch (err) {
        setError("Unable to load project details.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const formatEventStatus = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate.getTime() === today.getTime()) return "Today";
    return eventDate < today ? "Past" : "Upcoming";
  };

  const handleProjectFieldChange = (
    field: keyof Project,
    value: string | number
  ) => {
    if (!project) return;
    setProject({ ...project, [field]: value } as Project);
  };

  const handleEventChange = (
    index: number,
    field: "event_type" | "event_date",
    value: string
  ) => {
    if (!project) return;
    const updatedEvents = [...project.events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setProject({ ...project, events: updatedEvents });
  };

  const handleDeliverableChange = (
    index: number,
    field: "category",
    value: string
  ) => {
    if (!project) return;
    const updatedDeliverables = [...project.deliverables];
    updatedDeliverables[index] = {
      ...updatedDeliverables[index],
      [field]: value,
    };
    setProject({ ...project, deliverables: updatedDeliverables });
  };

  const handleDeliverableDetailsChange = (index: number, value: string) => {
    const updatedText = [...deliverableDetailsText];
    updatedText[index] = value;
    setDeliverableDetailsText(updatedText);
  };

  const handlePaymentChange = (
    index: number,
    field: keyof Payment,
    value: string | number | boolean
  ) => {
    if (!project) return;
    const updatedPayments = [...project.payments];
    updatedPayments[index] = {
      ...updatedPayments[index],
      [field]: value,
    } as Payment;
    setProject({ ...project, payments: updatedPayments });
  };

  const addEvent = () => {
    if (!project) return;
    setProject({
      ...project,
      events: [
        ...project.events,
        { id: undefined as any, project_id: project.id, event_type: "", event_date: "" } as any,
      ],
    });
  };

  const addDeliverable = () => {
    if (!project) return;
    setProject({
      ...project,
      deliverables: [
        ...project.deliverables,
        { id: undefined as any, project_id: project.id, category: "", details: {} } as any,
      ],
    });
    setDeliverableDetailsText([...deliverableDetailsText, "{}"]);
  };

  const addPayment = () => {
    if (!project) return;
    setProject({
      ...project,
      payments: [
        ...project.payments,
        { id: undefined as any, project_id: project.id, milestone: "", amount: 0, is_paid: false },
      ],
    });
  };

  const removeEvent = (index: number) => {
    if (!project) return;
    const updatedEvents = project.events.filter((_, idx) => idx !== index);
    setProject({ ...project, events: updatedEvents });
  };

  const removeDeliverable = (index: number) => {
    if (!project) return;
    setProject({
      ...project,
      deliverables: project.deliverables.filter((_, idx) => idx !== index),
    });
    setDeliverableDetailsText(
      deliverableDetailsText.filter((_, idx) => idx !== index)
    );
  };

  const removePayment = (index: number) => {
    if (!project) return;
    setProject({
      ...project,
      payments: project.payments.filter((_, idx) => idx !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setSaving(true);
    setError(null);

    try {
      const deliverables = project.deliverables.map((deliverable, index) => ({
        id: deliverable.id,
        category: deliverable.category,
        details: JSON.parse(deliverableDetailsText[index] || "{}"),
      }));

      const payload = {
        client_name: project.client_name,
        event_title: project.event_title,
        instagram_reference: project.instagram_reference,
        location: project.location,
        contact_number: project.contact_number,
        total_budget: project.total_budget,
        status: project.status,
        events: project.events.map((event) => ({
          id: event.id,
          event_type: event.event_type,
          event_date: event.event_date,
        })),
        deliverables,
        payments: project.payments.map((payment) => ({
          id: payment.id,
          milestone: payment.milestone,
          amount: payment.amount,
          is_paid: payment.is_paid,
          project_id: project.id,
        })),
      };

      await ApiService.updateProject(project.id, payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update project. Check JSON deliverable details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div style={{ color: colors.onSurface }}>Loading project...</div></Layout>;
  if (!project) return <Layout><div style={{ color: colors.danger }}>Project not found.</div></Layout>;

  return (
    <Layout>
      <LinkBack to="/projects">← Back to Projects</LinkBack>
      <PageHeader>
        <h1>Edit Project</h1>
      </PageHeader>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Project Overview</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>Client Name</Label>
              <Input
                type="text"
                value={project.client_name}
                onChange={(e) => handleProjectFieldChange("client_name", e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Event Title</Label>
              <Input
                type="text"
                value={project.event_title || ""}
                onChange={(e) => handleProjectFieldChange("event_title", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Instagram Handle/Ref</Label>
              <Input
                type="text"
                value={project.instagram_reference || ""}
                onChange={(e) => handleProjectFieldChange("instagram_reference", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                value={project.location}
                onChange={(e) => handleProjectFieldChange("location", e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Contact Number</Label>
              <Input
                type="text"
                value={project.contact_number}
                onChange={(e) => handleProjectFieldChange("contact_number", e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Total Budget (₹)</Label>
              <Input
                type="number"
                value={project.total_budget}
                onChange={(e) => handleProjectFieldChange("total_budget", Number(e.target.value))}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                value={project.status}
                onChange={(e) => handleProjectFieldChange("status", e.target.value)}
              >
                <option value={ProjectStatus.PENDING}>Pending</option>
                <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
                <option value={ProjectStatus.REVIEW}>Review</option>
                <option value={ProjectStatus.DELIVERED}>Delivered</option>
                <option value={ProjectStatus.COMPLETED}>Completed</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Calendar / Event Status</SectionTitle>
          <ListSection>
            {project.events.map((event, index) => (
              <MiniCard key={index}>
                <CardTitle style={{ fontSize: '1.2rem', marginBottom: spacing[2] }}>{event.event_type || `Event ${index + 1}`}</CardTitle>
                <FormGrid>
                  <FormGroup>
                    <Label>Event Type</Label>
                    <Input
                      value={event.event_type}
                      onChange={(e) => handleEventChange(index, "event_type", e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Event Date</Label>
                    <Input
                      type="date"
                      value={event.event_date}
                      onChange={(e) => handleEventChange(index, "event_date", e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Status</Label>
                    <div>
                      <Badge status={formatEventStatus(event.event_date)}>
                        {formatEventStatus(event.event_date)}
                      </Badge>
                    </div>
                  </FormGroup>
                </FormGrid>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeEvent(index)}
                  style={{ marginTop: spacing[4] }}
                >
                  Remove Event
                </Button>
              </MiniCard>
            ))}
            <Button type="button" variant="outline" onClick={addEvent} style={{ width: 'fit-content' }}>
              + Add Event
            </Button>
          </ListSection>
        </Section>

        <Section>
          <SectionTitle>Deliverables</SectionTitle>
          <ListSection>
            {project.deliverables.map((deliverable, index) => (
              <MiniCard key={index}>
                <CardTitle style={{ fontSize: '1.2rem', marginBottom: spacing[2] }}>{deliverable.category || `Deliverable ${index + 1}`}</CardTitle>
                <FormGrid>
                  <FormGroup>
                    <Label>Category</Label>
                    <Input
                      value={deliverable.category}
                      onChange={(e) => handleDeliverableChange(index, "category", e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup style={{ gridColumn: "1 / -1" }}>
                    <Label>Details (JSON)</Label>
                    <TextArea
                      value={deliverableDetailsText[index] || "{}"}
                      onChange={(e) => handleDeliverableDetailsChange(index, e.target.value)}
                    />
                  </FormGroup>
                </FormGrid>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeDeliverable(index)}
                  style={{ marginTop: spacing[4] }}
                >
                  Remove Deliverable
                </Button>
              </MiniCard>
            ))}
            <Button type="button" variant="outline" onClick={addDeliverable} style={{ width: 'fit-content' }}>
              + Add Deliverable
            </Button>
          </ListSection>
        </Section>

        <Section>
          <SectionTitle>Payment Schedule</SectionTitle>
          <ListSection>
            {project.payments.map((payment, index) => (
              <MiniCard key={index}>
                <FormGrid>
                  <FormGroup>
                    <Label>Milestone</Label>
                    <Input
                      value={payment.milestone}
                      onChange={(e) => handlePaymentChange(index, "milestone", e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={payment.amount}
                      onChange={(e) => handlePaymentChange(index, "amount", Number(e.target.value))}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Paid</Label>
                    <Select
                      value={payment.is_paid ? "true" : "false"}
                      onChange={(e) => handlePaymentChange(index, "is_paid", e.target.value === "true")}
                    >
                      <option value="false">Pending</option>
                      <option value="true">Paid</option>
                    </Select>
                  </FormGroup>
                </FormGrid>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removePayment(index)}
                  style={{ marginTop: spacing[4] }}
                >
                  Remove Payment
                </Button>
              </MiniCard>
            ))}
            <Button type="button" variant="outline" onClick={addPayment} style={{ width: 'fit-content' }}>
              + Add Payment Installment
            </Button>
          </ListSection>
        </Section>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <Badge status="Today" style={{ marginBottom: spacing[4] }}>Project updated successfully</Badge>}

        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving changes..." : "Save Project"}
        </Button>
      </Form>
    </Layout>
  );
};

export default ProjectDetail;
